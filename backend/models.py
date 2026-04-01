from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class Publication(Base):
    __tablename__ = "publications"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    author = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    last_synced_at = Column(DateTime, default=datetime.datetime.utcnow)

    posts = relationship("Post", back_populates="publication", cascade="all, delete-orphan")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    publication_id = Column(Integer, ForeignKey("publications.id"))
    title = Column(String, nullable=False)
    slug = Column(String, index=True, nullable=False)
    published_date = Column(DateTime, nullable=True)
    content_html = Column(Text, nullable=True)
    content_text = Column(Text, nullable=True)
    summary = Column(Text, nullable=True) # AI Generated
    tags = Column(String, nullable=True) # JSON or comma separated
    url = Column(String, nullable=False)

    publication = relationship("Publication", back_populates="posts")
