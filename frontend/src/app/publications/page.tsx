"use client";

import { useState, useEffect } from "react";
import { getPublications, addPublication } from "@/lib/api";
import { Plus, BookOpen, RefreshCw, Trash2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [newSlug, setNewSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPublications();
      setPublications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
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

  return (
    <div className="container mx-auto py-12 max-w-5xl px-4">
      <div className="flex flex-col gap-8">
        <div className="flex items-end justify-between border-b pb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Publications</h1>
            <p className="text-muted-foreground mt-2 text-lg">Manage your mirrored Substack sources.</p>
          </div>
          
          <form onSubmit={handleAdd} className="flex gap-3 bg-muted/50 p-1.5 rounded-xl border border-dashed">
            <Input
              placeholder="publication-slug"
              className="w-48 bg-background border-none shadow-none focus-visible:ring-1"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
            />
            <Button size="sm" className="rounded-lg px-4" disabled={syncing}>
              {syncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              {syncing ? "Syncing..." : "Add Source"}
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="h-10 w-10 animate-spin text-muted-foreground/30" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub) => (
              <Card key={pub.id} className="group hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      <BookOpen size={20} />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {pub.name || pub.slug}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {pub.author || "Substack Publication"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 mt-2">
                    <a 
                      href={`https://${pub.slug}.substack.com`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe size={12} />
                      Substack Page
                    </a>
                  </div>
                  <div className="mt-6 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    <span>Last synced: {new Date(pub.last_synced_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {publications.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl bg-muted/10">
                <div className="max-w-xs mx-auto space-y-4">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/20" />
                  <h3 className="text-lg font-semibold">No publications yet</h3>
                  <p className="text-sm text-muted-foreground">Add your first Substack publication slug above to start mirroring content.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
