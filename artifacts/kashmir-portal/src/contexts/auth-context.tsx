import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type AuthUser = { id: number; name: string; email: string };
type UnlockedNote = { noteId: string; noteTitle: string; subject: string; classLevel: string; accessCode: string };

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  unlockedNotes: UnlockedNote[];
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
  refreshUnlocked: () => Promise<void>;
  isNoteUnlocked: (noteId: string) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("kp_token"));
  const [unlockedNotes, setUnlockedNotes] = useState<UnlockedNote[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUnlocked = useCallback(async (tok?: string) => {
    const t = tok ?? token;
    if (!t) return;
    try {
      const res = await fetch(`${BASE}/api/auth/my-notes`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) setUnlockedNotes(await res.json());
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => {
    const savedToken = localStorage.getItem("kp_token");
    if (!savedToken) { setLoading(false); return; }

    fetch(`${BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${savedToken}` } })
      .then(async (res) => {
        if (res.ok) {
          const u = await res.json();
          setUser(u);
          setToken(savedToken);
          await refreshUnlocked(savedToken);
        } else {
          localStorage.removeItem("kp_token");
          setToken(null);
        }
      })
      .catch(() => { localStorage.removeItem("kp_token"); setToken(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error ?? "Login failed";
      localStorage.setItem("kp_token", data.token);
      setToken(data.token);
      setUser(data.user);
      await refreshUnlocked(data.token);
      return null;
    } catch { return "Network error. Please try again."; }
  };

  const signup = async (name: string, email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error ?? "Signup failed";
      localStorage.setItem("kp_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setUnlockedNotes([]);
      return null;
    } catch { return "Network error. Please try again."; }
  };

  const logout = () => {
    localStorage.removeItem("kp_token");
    setToken(null);
    setUser(null);
    setUnlockedNotes([]);
  };

  const isNoteUnlocked = (noteId: string) => unlockedNotes.some((n) => n.noteId === noteId);

  return (
    <AuthContext.Provider value={{ user, token, unlockedNotes, loading, login, signup, logout, refreshUnlocked, isNoteUnlocked }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
