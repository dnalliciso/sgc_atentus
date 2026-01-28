"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface StatusChartProps {
  activas: number;
  inactivas: number;
  devueltas: number;
  investigadas: number;
  suprimidas: number;
}

const COLORS = {
  activas: "#22c55e",
  inactivas: "#6b7280",
  devueltas: "#f97316",
  investigadas: "#eab308",
  suprimidas: "#ef4444",
};

export function StatusChart({
  activas,
  inactivas,
  devueltas,
  investigadas,
  suprimidas,
}: StatusChartProps) {
  const data = [
    { name: "Activas", value: activas, color: COLORS.activas },
    { name: "Inactivas", value: inactivas, color: COLORS.inactivas },
    { name: "Devueltas", value: devueltas, color: COLORS.devueltas },
    { name: "Investigadas", value: investigadas, color: COLORS.investigadas },
    { name: "Suprimidas ARCOS", value: suprimidas, color: COLORS.suprimidas },
  ].filter((d) => d.value > 0);

  const total = activas + inactivas + devueltas + investigadas + suprimidas;

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Distribución por Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
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
                formatter={(value: number) => [
                  `${value} cuentas (${((value / total) * 100).toFixed(1)}%)`,
                  "Cantidad",
                ]}
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
