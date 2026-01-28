"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { UserAccount } from "@/lib/users-store";

interface AccountTypeChartProps {
  users: UserAccount[];
}

const ACCOUNT_LABELS: Record<string, string> = {
  corriente: "Cuenta Corriente",
  vista: "Cuenta Vista",
  fan: "Cuenta FAN",
  inversiones: "Cuenta Inversiones",
  credito: "Cuenta Crédito",
};

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#8b5cf6", "#ec4899"];

export function AccountTypeChart({ users }: AccountTypeChartProps) {
  const data = useMemo(() => {
    const typeCount: Record<string, number> = {};
    users.forEach((user) => {
      const type = user.bankDetails.tipoCuenta;
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([type, count], index) => ({
      name: ACCOUNT_LABELS[type] || type,
      value: count,
      color: COLORS[index % COLORS.length],
    }));
  }, [users]);

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Tipos de Cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value} cuentas`, "Cantidad"]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
