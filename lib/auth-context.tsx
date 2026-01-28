"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getAppUsers, type AppUser } from "@/lib/app-users-store";

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  role: UserRole;
  codigoSeguridad: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  validateSecurityCode: (code: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credencial del administrador del sistema
const ADMIN_USER: AuthUser = {
  id: "admin-1",
  email: "soporte_sgc@atentus.com",
  nombre: "Soporte",
  apellido: "SGC",
  telefono: "+56 9 0000 0000",
  role: "admin",
  codigoSeguridad: "123456",
};

const ADMIN_PASSWORD = "Admin.SGC.2025";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verificar si es el admin
    if (email === ADMIN_USER.email && password === ADMIN_PASSWORD) {
      setUser(ADMIN_USER);
      sessionStorage.setItem("user", JSON.stringify(ADMIN_USER));
      return true;
    }

    // Verificar usuarios de la aplicación
    const appUsers = getAppUsers();
    const appUser = appUsers.find(
      (u) => u.email === email && u.password === password && u.activo
    );

    if (appUser) {
      const authUser: AuthUser = {
        id: appUser.id,
        email: appUser.email,
        nombre: appUser.nombre,
        apellido: appUser.apellido,
        telefono: appUser.telefono,
        role: "user",
        codigoSeguridad: appUser.codigoSeguridad,
      };
      setUser(authUser);
      sessionStorage.setItem("user", JSON.stringify(authUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  const validateSecurityCode = (code: string): boolean => {
    if (!user) return false;
    return user.codigoSeguridad === code;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, validateSecurityCode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
