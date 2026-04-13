import { Link, useLocation } from "wouter";
import { MountainSnow, BookOpen, BarChart3, Clock, Menu, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: MountainSnow },
    { name: "History", href: "/history", icon: Clock },
    { name: "Data Hub", href: "/data", icon: BarChart3 },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Study Notes", href: "/notes", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <MountainSnow className="h-6 w-6" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-primary">Kashmir Portal</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => {
                  const isActive = location === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t bg-muted/40 mt-auto py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-lg font-medium text-foreground mb-2">Kashmir Portal</p>
          <p className="text-sm text-muted-foreground">A passion project by Yasir Ferooz</p>
          <div className="mt-6 text-xs text-muted-foreground/60 flex items-center justify-center gap-4">
            <span>© {new Date().getFullYear()} Yasir Ferooz</span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span>Made with love for Kashmir</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
