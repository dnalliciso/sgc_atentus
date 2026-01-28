"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { UserAccount } from "@/lib/users-store";

interface AbonosTimelineChartProps {
  users: UserAccount[];
}

export function AbonosTimelineChart({ users }: AbonosTimelineChartProps) {
  const data = useMemo(() => {
    const monthlyData: Record<string, { total: number; count: number }> = {};

    users.forEach((user) => {
      user.abonos.forEach((abono) => {
        const date = new Date(abono.fecha);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { total: 0, count: 0 };
        }
        monthlyData[monthKey].total += abono.monto;
        monthlyData[monthKey].count += 1;
      });
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month: formatMonth(month),
        total: data.total,
        count: data.count,
        promedio: Math.round(data.total / data.count),
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);
  }, [users]);

  const totalAbonos = data.reduce((sum, d) => sum + d.total, 0);
  const totalTransacciones = data.reduce((sum, d) => sum + d.count, 0);

  function formatMonth(monthKey: string) {
    const [year, month] = monthKey.split("-");
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1);
    return date.toLocaleDateString("es-CL", { month: "short", year: "2-digit" });
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Historial de Abonos</CardTitle>
            <CardDescription>Evolución mensual de abonos recibidos</CardDescription>
          </div>
          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total período</p>
              <p className="text-lg font-bold text-primary">
                {new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                  minimumFractionDigits: 0,
                }).format(totalAbonos)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Transacciones</p>
              <p className="text-lg font-bold text-foreground">{totalTransacciones}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [
                  new Intl.NumberFormat("es-CL", {
                    style: "currency",
                    currency: "CLP",
                    minimumFractionDigits: 0,
                  }).format(value),
                  "Total",
                ]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
