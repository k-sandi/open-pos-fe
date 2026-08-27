"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const publicRoutes = ["/login"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, fetchUser, isAuthenticated, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isPublic = publicRoutes.includes(pathname);

    if (!token && !isPublic) {
      router.replace("/login");
      return;
    }

    if (token && isPublic) {
      router.replace("/admin");
      return;
    }

    if (token && !user && !isLoading) {
      fetchUser();
    }
  }, [token, user, isAuthenticated, isLoading, pathname, mounted, router, fetchUser]);

  if (!mounted) {
    return null;
  }

  // Prevent flashing protected content before redirection
  const isPublic = publicRoutes.includes(pathname);
  if (!token && !isPublic) {
    return null;
  }

  return <>{children}</>;
}
