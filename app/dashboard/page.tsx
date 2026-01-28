"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserStats } from "@/components/dashboard/user-stats";
import { UsersTable } from "@/components/dashboard/users-table";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        user={{
          email: user.email,
          name: `${user.nombre} ${user.apellido}`,
        }}
      />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Gestión de Cuentas
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las cuentas bancarias del sistema
          </p>
        </div>
        <UserStats />
        <UsersTable />
      </main>
    </div>
  );
}
