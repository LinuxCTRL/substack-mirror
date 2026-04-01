import Link from "next/link";
import { BookOpen, Search, Command } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <BookOpen size={20} />
            </div>
            <span>Substack Mirror</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Archive
          </Link>
          <Link href="/publications" className="text-sm font-medium transition-colors hover:text-primary">
            Publications
          </Link>
          <div className="flex items-center gap-4 border-l pl-6 ml-2">
            <Link 
              href="https://github.com/LinuxCTRL" 
              target="_blank" 
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Command size={20} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
