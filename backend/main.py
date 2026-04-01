from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import asyncio

from database import get_db, init_db
from models import Publication, Post
from worker import SubstackClient, parse_date

app = FastAPI(title="Substack Mirror API")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, change this to your specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/publications/{slug}")
async def add_publication(slug: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Add a new publication and trigger an initial sync."""
    existing = db.query(Publication).filter(Publication.slug == slug).first()
    if existing:
        return {"message": "Publication already exists", "slug": slug}
    
    new_pub = Publication(slug=slug, name=slug)
    db.add(new_pub)
    db.commit()
    db.refresh(new_pub)
    
    background_tasks.add_task(sync_publication_task, slug)
    return {"message": "Publication added, sync started", "slug": slug}

@app.get("/publications")
def list_publications(db: Session = Depends(get_db)):
    return db.query(Publication).all()

@app.get("/posts")
def list_posts(publication_slug: Optional[str] = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(Post)
    if publication_slug:
        query = query.join(Publication).filter(Publication.slug == publication_slug)
    return query.order_by(Post.published_date.desc()).offset(skip).limit(limit).all()

@app.get("/posts/search")
def search_posts(q: str, db: Session = Depends(get_db)):
    return db.query(Post).filter(
        (Post.title.contains(q)) | (Post.content_text.contains(q)) | (Post.tags.contains(q))
    ).limit(50).all()

@app.get("/posts/{slug}")
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.post("/sync/{slug}")
async def trigger_sync(slug: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(sync_publication_task, slug)
    return {"message": "Sync triggered", "slug": slug}

async def sync_publication_task(slug: str):
    """Background task to sync posts for a publication."""
    from database import SessionLocal # Local import for background task
    db = SessionLocal()
    try:
        pub = db.query(Publication).filter(Publication.slug == slug).first()
        if not pub:
            return

        client = SubstackClient(slug)
        
        # Fetch latest 50 posts for now
        posts_data = await client.get_all_posts(max_posts=50)
        
        for p_data in posts_data:
            post_slug = p_data.get("slug")
            # Check if post already exists
            existing_post = db.query(Post).filter(Post.slug == slug, Post.publication_id == pub.id).first() # Fix: should check slug and pub_id
            # Wait, the previous logic was slightly off, fixing slug check
            existing_post = db.query(Post).filter(Post.slug == post_slug, Post.publication_id == pub.id).first()
            if existing_post:
                continue
                
            # Process content
            body_html = p_data.get("body_html", "")
            body_text = p_data.get("body_text", "")
            if not body_text and body_html:
                from bs4 import BeautifulSoup
                body_text = BeautifulSoup(body_html, "lxml").get_text(separator=' ', strip=True)

            new_post = Post(
                publication_id=pub.id,
                title=p_data.get("title", ""),
                slug=post_slug,
                published_date=parse_date(p_data.get("post_date", "")),
                content_html=client.clean_html(body_html),
                content_text=body_text,
                summary=None,
                tags=None,
                url=f"https://{slug}.substack.com/p/{post_slug}"
            )
            db.add(new_post)
            db.commit()
            
        # Update metadata if available from first post
        if posts_data:
            pub.name = posts_data[0].get("publication", {}).get("name", pub.name)
            pub.author = posts_data[0].get("publication", {}).get("author_name", pub.author)
            db.commit()
            
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Sync error for {slug}: {e}")
    finally:
        db.close()
