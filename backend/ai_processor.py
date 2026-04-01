from google import genai
import os
from typing import Dict, List, Optional
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class GeminiProcessor:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or GEMINI_API_KEY
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found. AI processing will be disabled.")
            self.client = None
        else:
            # Using the new google-genai client
            self.client = genai.Client(api_key=self.api_key)
            self.model_id = "gemini-1.5-flash"

    async def summarize_post(self, title: str, content_text: str) -> Optional[str]:
        """Generate a 3-bullet point summary of the post."""
        if not self.client:
            return None
        
        prompt = f"""
        Analyze the following Substack article and provide a concise summary in exactly 3 bullet points.
        Focus on the core arguments or technical takeaways.

        Title: {title}
        Content: {content_text[:4000]}
        """
        
        try:
            # The new SDK uses client.models.generate_content
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini summarization error: {e}")
            return None

    async def extract_tags(self, title: str, content_text: str) -> List[str]:
        """Extract relevant technical or topical tags from the post."""
        if not self.client:
            return []
        
        prompt = f"""
        Extract the 5 most relevant keywords or tags from this article.
        Return ONLY a comma-separated list of strings.

        Title: {title}
        Content: {content_text[:3000]}
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            tags = [t.strip() for t in response.text.split(",") if t.strip()]
            return tags[:5]
        except Exception as e:
            logger.error(f"Gemini tag extraction error: {e}")
            return []

    async def process_post(self, title: str, content_text: str) -> Dict[str, any]:
        """Process post to get both summary and tags."""
        summary = await self.summarize_post(title, content_text)
        tags = await self.extract_tags(title, content_text)
        return {
            "summary": summary,
            "tags": ",".join(tags)
        }
