"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DashboardHeader } from "@/components/dashboard/header";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        user={{
          email: user.email,
          name: `${user.nombre} ${user.apellido}`,
        }}
      />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
