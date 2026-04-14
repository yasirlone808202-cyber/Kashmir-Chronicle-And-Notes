import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MountainSnow, BookOpen, BarChart3, Clock, Menu, Compass, User, LogOut, LogIn, UserPlus, AlertCircle, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, loading, login, signup, logout } = useAuth();

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: MountainSnow },
    { name: "History", href: "/history", icon: Clock },
    { name: "Data Hub", href: "/data", icon: BarChart3 },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Study Notes", href: "/notes", icon: BookOpen },
  ];

  const openLogin = () => { setAuthMode("login"); setForm({ name: "", email: "", password: "" }); setAuthError(""); setShowAuth(true); };
  const openSignup = () => { setAuthMode("signup"); setForm({ name: "", email: "", password: "" }); setAuthError(""); setShowAuth(true); };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    let err: string | null;
    if (authMode === "login") {
      err = await login(form.email, form.password);
    } else {
      err = await signup(form.name, form.email, form.password);
    }
    setAuthLoading(false);
    if (err) { setAuthError(err); }
    else { setShowAuth(false); }
  };

  const initials = user?.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) ?? "?";

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
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                    {initials}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link href="/my-notes" onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors w-full text-left">
                        <Library className="h-4 w-4 text-amber-600" /> My Notes
                      </Link>
                      <button onClick={() => { logout(); setShowUserMenu(false); }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={openLogin} className="gap-1.5 text-muted-foreground">
                  <LogIn className="h-4 w-4" /> Login
                </Button>
                <Button size="sm" onClick={openSignup} className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white">
                  <UserPlus className="h-4 w-4" /> Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px]">
              <nav className="flex flex-col gap-2 mt-8">
                {navigation.map((item) => {
                  const isActive = location === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}>
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
                <div className="border-t border-border mt-2 pt-4 px-2 space-y-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 px-2 py-1">
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{initials}</div>
                        <div className="min-w-0"><p className="text-sm font-semibold truncate">{user.name}</p><p className="text-xs text-muted-foreground truncate">{user.email}</p></div>
                      </div>
                      <Link href="/my-notes"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors">
                        <Library className="h-4 w-4" /> My Notes
                      </Link>
                      <Button variant="outline" size="sm" className="w-full gap-2 text-red-600 border-red-200" onClick={logout}>
                        <LogOut className="h-4 w-4" /> Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" className="w-full gap-2" onClick={openLogin}><LogIn className="h-4 w-4" /> Login</Button>
                      <Button size="sm" className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white" onClick={openSignup}><UserPlus className="h-4 w-4" /> Sign Up</Button>
                    </>
                  )}
                </div>
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
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Made with love for Kashmir</span>
          </div>
        </div>
      </footer>

      {/* Auth Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {authMode === "login" ? "Welcome back" : "Create account"}
            </DialogTitle>
            <DialogDescription>
              {authMode === "login"
                ? "Sign in to access your unlocked notes from any device."
                : "Sign up to keep your purchased notes forever, on any device."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAuth} className="space-y-4 pt-2">
            {authMode === "signup" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Your name" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Address</label>
              <Input type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required autoFocus={authMode === "login"} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Password</label>
              <Input type="password" placeholder={authMode === "signup" ? "Min. 6 characters" : "Enter password"}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" /> {authError}
              </div>
            )}

            <Button type="submit" disabled={authLoading} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold h-11">
              {authLoading ? (authMode === "login" ? "Signing in..." : "Creating account...") : (authMode === "login" ? "Sign In" : "Create Account")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {authMode === "login" ? (
                <>Don't have an account?{" "}<button type="button" onClick={() => { setAuthMode("signup"); setAuthError(""); }} className="text-amber-600 font-semibold hover:underline">Sign up</button></>
              ) : (
                <>Already have an account?{" "}<button type="button" onClick={() => { setAuthMode("login"); setAuthError(""); }} className="text-amber-600 font-semibold hover:underline">Sign in</button></>
              )}
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
