"use client";

import { useState, useEffect } from "react";
import { getPosts, getPublications, addPublication, searchPosts } from "@/lib/api";
import { Search, Plus, BookOpen, RefreshCw, ChevronRight, Newspaper, HelpCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsData, pubsData] = await Promise.all([
        getPosts(),
        getPublications()
      ]);
      setPosts(postsData);
      setPublications(pubsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug) return;
    try {
      setSyncing(true);
      await addPublication(newSlug);
      setNewSlug("");
      await fetchData();
    } catch (error) {
      alert("Error adding publication");
    } finally {
      setSyncing(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      fetchData();
      return;
    }
    try {
      const results = await searchPosts(searchQuery);
      setPosts(results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-16 max-w-4xl px-4">
      <div className="flex flex-col gap-16">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b pb-12">
          <div className="space-y-3">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] uppercase font-bold tracking-[0.2em]">
              Personal Intelligence Archive
            </Badge>
            <h1 className="text-6xl font-black tracking-tight leading-none">Reading Room</h1>
            <p className="text-muted-foreground text-xl max-w-lg leading-relaxed">
              Your curated Substack collection, mirrored for deep focus and offline study.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search your archive..." 
                className="pl-11 h-14 w-full md:w-80 rounded-2xl bg-muted/40 border-none shadow-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <form onSubmit={handleAddPublication} className="flex gap-2 p-1.5 bg-muted/30 rounded-2xl border border-dashed">
              <Input
                placeholder="publication-slug"
                className="h-10 border-none bg-transparent shadow-none focus-visible:ring-0"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
              />
              <Button size="sm" className="rounded-xl px-4 shadow-lg shadow-primary/20" disabled={syncing}>
                {syncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>

        {/* How to Use Section */}
        <section className="bg-primary/[0.02] border border-primary/5 rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 select-none">
            <HelpCircle size={120} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
              <Info size={16} />
              Quick Start Guide
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <h3 className="font-bold">Find a Slug</h3>
                <p className="text-sm text-muted-foreground">Go to a Substack newsletter (e.g. <span className="text-foreground font-medium">notboring</span>.substack.com).</p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <h3 className="font-bold">Mirror Content</h3>
                <p className="text-sm text-muted-foreground">Enter the slug above and hit plus. We'll fetch the latest 50 issues.</p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <h3 className="font-bold">Read & Focus</h3>
                <p className="text-sm text-muted-foreground">Click on any post to read it in a distraction-free "Zen Mode" reader.</p>
              </div>
            </div>
          </div>
        </section>

        <main className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2.5">
              <Newspaper size={16} className="text-primary/40" />
              Latest Issues
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent ml-8" />
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <RefreshCw className="h-10 w-10 animate-spin text-muted-foreground/10" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24 bg-muted/5 rounded-[2.5rem] border-2 border-dashed border-muted/50">
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/10 mb-6" />
              <h3 className="text-xl font-bold">Your library is empty</h3>
              <p className="text-muted-foreground mt-2">Add a publication slug above to start mirroring your favorite content.</p>
            </div>
          ) : (
            <div className="grid gap-12">
              {posts.map((post) => (
                <article key={post.id} className="group relative flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        {(post.publication?.name || "P")[0]}
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-0.5">
                          {post.publication?.name || "Publication"}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground">
                          {new Date(post.published_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Link href={`/posts/${post.slug}`}>
                      <h3 className="text-3xl font-bold leading-[1.15] group-hover:text-primary transition-colors duration-300 tracking-tight">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed text-lg italic opacity-80">
                      {post.content_text?.substring(0, 260).replace(/&nbsp;/g, ' ')}...
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-muted/50">
                    <Link href={`/posts/${post.slug}`} className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 group/btn">
                      Read Issue
                      <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
