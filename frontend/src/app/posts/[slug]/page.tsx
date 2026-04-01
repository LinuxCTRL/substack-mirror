"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPost } from "@/lib/api";
import { ArrowLeft, ExternalLink, Calendar, BookOpen, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getPost(slug as string);
      setPost(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 max-w-3xl">
        <Skeleton className="h-4 w-20 mb-8" />
        <Skeleton className="h-16 w-full mb-4" />
        <Skeleton className="h-4 w-1/2 mb-16" />
        <div className="space-y-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Issue not found</h1>
        <Button onClick={() => router.push("/")}>Return to Library</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Reader Progress Header */}
      <div className="sticky top-16 z-40 w-full h-1 bg-muted">
        <div className="h-full bg-primary/20 w-full" />
      </div>

      <div className="container mx-auto py-12 max-w-3xl px-4">
        <div className="flex justify-between items-center mb-12">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-primary transition-colors -ml-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Library
          </Button>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Share2 size={16} />
            </Button>
            <a href={post.url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <ExternalLink size={16} />
              </Button>
            </a>
          </div>
        </div>

        <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="mb-16 space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-primary border-primary/20 px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-primary/5">
                {post.publication?.name || "Newsletter"}
              </Badge>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <div className="flex items-center text-xs font-medium text-muted-foreground">
                {new Date(post.published_date).toLocaleDateString(undefined, { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed italic border-l-2 border-primary/10 pl-6">
              Mirrored from {post.publication?.author || "Substack"}.
            </p>
          </header>

          <div 
            className="prose prose-slate dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
          
          <footer className="mt-24 pt-12 border-t flex flex-col items-center gap-6">
            <div className="p-4 bg-muted/30 rounded-2xl text-center max-w-sm">
              <BookOpen className="mx-auto h-6 w-6 text-primary mb-2" />
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                End of Issue
              </p>
            </div>
          
        </footer>
      </article>
      </div>
    </div>
  );
}
