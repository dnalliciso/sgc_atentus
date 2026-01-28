"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, AlertTriangle, FileWarning, Ban } from "lucide-react";
import { getUsers } from "@/lib/users-store";
import useSWR from "swr";

export function UserStats() {
  const { data: users = [] } = useSWR("users", getUsers);

  const stats = {
    total: users.length,
    activo: users.filter((u) => u.status === "activo").length,
    inactivo: users.filter((u) => u.status === "inactivo").length,
    devuelto: users.filter((u) => u.status === "devuelto").length,
    investigada: users.filter((u) => u.status === "investigada").length,
    suprimida: users.filter((u) => u.status === "suprimida_arcos").length,
  };

  const statCards = [
    {
      label: "Total Cuentas",
      value: stats.total,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Activas",
      value: stats.activo,
      icon: UserCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Inactivas",
      value: stats.inactivo,
      icon: UserX,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      label: "Devueltas",
      value: stats.devuelto,
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Investigadas",
      value: stats.investigada,
      icon: FileWarning,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Suprimidas ARCOS",
      value: stats.suprimida,
      icon: Ban,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {statCards.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bgColor}`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
