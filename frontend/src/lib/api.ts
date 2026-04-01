const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getPosts(publicationSlug?: string) {
  const url = publicationSlug 
    ? `${API_BASE_URL}/posts?publication_slug=${publicationSlug}`
    : `${API_BASE_URL}/posts`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(slug: string) {
  const res = await fetch(`${API_BASE_URL}/posts/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export async function getPublications() {
  const res = await fetch(`${API_BASE_URL}/publications`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch publications");
  return res.json();
}

export async function addPublication(slug: string) {
  const res = await fetch(`${API_BASE_URL}/publications/${slug}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to add publication");
  return res.json();
}

export async function searchPosts(q: string) {
  const res = await fetch(`${API_BASE_URL}/posts/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to search posts");
  return res.json();
}
