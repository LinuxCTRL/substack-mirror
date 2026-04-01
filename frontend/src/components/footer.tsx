import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold">
              <BookOpen className="text-primary" size={20} />
              <span>Substack Mirror</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your personal intelligence engine for mirroring, archiving, and analyzing Substack newsletters.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <div className="text-sm font-semibold">Project</div>
            <div className="flex flex-col gap-1 md:items-end text-sm text-muted-foreground">
              <a href="https://substack.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Substack</a>
              <a href="https://gemini.google.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Google Gemini</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Substack Mirror. Built with Next.js & FastAPI.
        </div>
      </div>
    </footer>
  );
}
