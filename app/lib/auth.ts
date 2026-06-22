// Authentication utility functions

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "customer" | "moderator";
  phone?: string;
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  // Support legacy/admin key names to avoid silent unauthenticated requests.
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("admin_token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token");

  return token || null;
}

export function isAdminUser(): boolean {
  const user = getStoredUser();
  return user?.role === "admin";
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }
}

export function setAuth(token: string, user: AuthUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    // Mirror token under admin alias for compatibility with older client code.
    localStorage.setItem("admin_token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
}
