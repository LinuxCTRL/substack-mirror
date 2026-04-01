import httpx
import asyncio
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SubstackClient:
    def __init__(self, publication_slug: str, session_cookie: Optional[str] = None):
        self.publication_slug = publication_slug
        self.base_url = f"https://{publication_slug}.substack.com"
        self.api_url = f"{self.base_url}/api/v1"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json"
        }
        if session_cookie:
            self.headers["Cookie"] = f"substack.sid={session_cookie}"

    async def fetch_posts_metadata(self, limit: int = 50, offset: int = 0) -> List[Dict]:
        """Fetch post metadata from the archive API."""
        url = f"{self.api_url}/posts"
        params = {"limit": limit, "offset": offset, "sort": "new"}
        
        async with httpx.AsyncClient(headers=self.headers, follow_redirects=True) as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                logger.error(f"Error fetching posts metadata for {self.publication_slug}: {e}")
                return []

    async def fetch_post_content(self, post_slug: str) -> Optional[Dict]:
        """Fetch full post content by slug."""
        url = f"{self.api_url}/posts/{post_slug}"
        
        async with httpx.AsyncClient(headers=self.headers, follow_redirects=True) as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                return response.json()
            except Exception as e:
                logger.error(f"Error fetching post content for {post_slug}: {e}")
                return None

    def clean_html(self, html_content: str) -> str:
        """Clean HTML content to remove tracking and junk."""
        if not html_content:
            return ""
        soup = BeautifulSoup(html_content, "lxml")
        
        # Remove common tracking/junk elements
        for tag in soup.find_all(["script", "style", "iframe"]):
            tag.decompose()
            
        # Optional: remove specific substack classes or ads if identified
        
        return str(soup)

    async def get_all_posts(self, max_posts: int = 100) -> List[Dict]:
        """Fetch all posts metadata and their full content."""
        all_posts = []
        offset = 0
        limit = 50
        
        while len(all_posts) < max_posts:
            logger.info(f"Fetching posts metadata for {self.publication_slug} (offset: {offset})")
            metadata_batch = await self.fetch_posts_metadata(limit=limit, offset=offset)
            
            if not metadata_batch:
                break
                
            for meta in metadata_batch:
                if len(all_posts) >= max_posts:
                    break
                    
                post_slug = meta.get("slug")
                logger.info(f"Fetching full content for post: {post_slug}")
                full_post = await self.fetch_post_content(post_slug)
                
                if full_post:
                    # Merge metadata with full content
                    combined = {**meta, **full_post}
                    all_posts.append(combined)
                
                # Sleep briefly to avoid rate limiting
                await asyncio.sleep(0.5)
            
            offset += limit
            if len(metadata_batch) < limit:
                break
                
        return all_posts

# Utility function to parse date
def parse_date(date_str: str) -> datetime.datetime:
    try:
        # Substack typically uses ISO format
        return datetime.datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except:
        return datetime.datetime.utcnow()
