"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthUser {
  nombre: string;
  usuario: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  logout: () => {},
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${t}` } })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          setToken(t);
          setUser(JSON.parse(u));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (pathname !== "/login") router.push("/login");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      if (pathname !== "/login") router.push("/login");
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, logout, loading }}>
      {loading ? (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-secondary text-[40px]">hourglass_empty</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
