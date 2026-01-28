"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Users, UserCheck, UserX } from "lucide-react";
import type { UserAccount } from "@/lib/users-store";

interface ReferidosAnalysisProps {
  users: UserAccount[];
  cuentasConReferido: number;
}

export function ReferidosAnalysis({ users, cuentasConReferido }: ReferidosAnalysisProps) {
  const sinReferido = users.length - cuentasConReferido;
  
  const statusByReferido = useMemo(() => {
    const conReferido = users.filter((u) => u.referido !== null);
    const sinRef = users.filter((u) => u.referido === null);

    const getStatusCount = (list: UserAccount[]) => ({
      activo: list.filter((u) => u.status === "activo").length,
      inactivo: list.filter((u) => u.status === "inactivo").length,
      otros: list.filter((u) => 
        ["devuelto", "investigada", "suprimida_arcos"].includes(u.status)
      ).length,
    });

    return {
      conReferido: getStatusCount(conReferido),
      sinReferido: getStatusCount(sinRef),
    };
  }, [users]);

  const data = [
    {
      name: "Con Referido",
      activo: statusByReferido.conReferido.activo,
      inactivo: statusByReferido.conReferido.inactivo,
      otros: statusByReferido.conReferido.otros,
    },
    {
      name: "Sin Referido",
      activo: statusByReferido.sinReferido.activo,
      inactivo: statusByReferido.sinReferido.inactivo,
      otros: statusByReferido.sinReferido.otros,
    },
  ];

  const porcentajeConReferido = ((cuentasConReferido / users.length) * 100).toFixed(1);

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Análisis de Referidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Con Referido</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{cuentasConReferido}</p>
            <p className="text-xs text-primary">{porcentajeConReferido}% del total</p>
          </div>
          <div className="p-4 rounded-lg bg-muted border border-border">
            <div className="flex items-center gap-2 mb-2">
              <UserX className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sin Referido</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{sinReferido}</p>
            <p className="text-xs text-muted-foreground">
              {(100 - Number.parseFloat(porcentajeConReferido)).toFixed(1)}% del total
            </p>
          </div>
        </div>

        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="activo" stackId="a" fill="#22c55e" name="Activo" />
              <Bar dataKey="inactivo" stackId="a" fill="#6b7280" name="Inactivo" />
              <Bar dataKey="otros" stackId="a" fill="#f97316" name="Otros" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
