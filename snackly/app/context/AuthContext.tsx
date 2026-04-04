"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  username: string;
  role: "admin" | "customer";
  user_id: number;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 1. REHYDRATION: Improved check
  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    };

    const session = getCookie("session_active");
    const storedUsername = getCookie("stored_username");
    const storedId = getCookie("stored_user_id");
    const storedRole = getCookie("stored_role");

    // Strictly check for the string "true"
    if (session === "true" && storedUsername && storedId) {
      setUser({
        username: decodeURIComponent(storedUsername), // Handle special characters in names
        user_id: parseInt(storedId),
        role: (storedRole as "admin" | "customer") || "customer",
      });
    }
    setIsLoading(false);
  }, []);

  // 2. AUTO-REDIRECT: Handle navigation based on auth state
  useEffect(() => {
    if (!isLoading && user && (pathname === "/login" || pathname === "/register")) {
      const destination = user.role === "admin" ? "/admin" : "/menu";
      router.push(destination);
    }
  }, [user, pathname, router, isLoading]);

  const login = (userData: User) => {
    setUser(userData);

    // Set cookies so Middleware and Refresh work together
    const expires = "; max-age=3600; path=/; SameSite=Lax";
    document.cookie = `session_active=true${expires}`;
    document.cookie = `stored_username=${userData.username}${expires}`;
    document.cookie = `stored_user_id=${userData.user_id}${expires}`;
    document.cookie = `stored_role=${userData.role}${expires}`;
  };

  const logout = () => {
    setUser(null);
    
    // Use a helper to clear cookies properly
    const cookies = ["session_active", "stored_username", "stored_user_id", "stored_role"];
    cookies.forEach(name => {
      // Setting an old date is the most reliable way to delete
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;
    });
    
    router.replace("/login"); // replace is better than push for logout to clear history
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {/* Optional: Add a small loading spinner here if isLoading is true */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};