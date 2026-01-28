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
} from "recharts";
import type { UserAccount } from "@/lib/users-store";

interface BankDistributionChartProps {
  users: UserAccount[];
}

export function BankDistributionChart({ users }: BankDistributionChartProps) {
  const data = useMemo(() => {
    const bankCount: Record<string, number> = {};
    users.forEach((user) => {
      const bank = user.bankDetails.banco;
      bankCount[bank] = (bankCount[bank] || 0) + 1;
    });

    return Object.entries(bankCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [users]);

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Cuentas por Banco</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
                formatter={(value: number) => [`${value} cuentas`, "Cantidad"]}
              />
              <Bar dataKey="count" fill="var(--chart-4)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
