// contexts/AuthContext.tsx
"use client";

import { ProfileLogin } from "@/schemas/userProfile-schema";
import { createContext, useContext } from "react";

const AuthContext = createContext<{ user: ProfileLogin | null }>({
  user: null,
});

export function AuthProvider({
  user,
  children,
}: {
  user: ProfileLogin | null;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
