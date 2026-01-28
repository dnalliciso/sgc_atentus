"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";

interface KpiCardsProps {
  totalCuentas: number;
  cuentasActivas: number;
  totalAbonos: number;
  totalMantencion: number;
  cuentasConReferido: number;
  cuentasInvestigadas: number;
  cuentasSuprimidas: number;
}

export function KpiCards({
  totalCuentas,
  cuentasActivas,
  totalAbonos,
  totalMantencion,
  cuentasConReferido,
  cuentasInvestigadas,
  cuentasSuprimidas,
}: KpiCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const kpis = [
    {
      title: "Total Cuentas",
      value: totalCuentas.toString(),
      icon: CreditCard,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Cuentas Activas",
      value: cuentasActivas.toString(),
      subtitle: `${((cuentasActivas / totalCuentas) * 100).toFixed(0)}% del total`,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Abonos",
      value: formatCurrency(totalAbonos),
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Costos Mantención",
      value: formatCurrency(totalMantencion),
      subtitle: "Mensual",
      icon: DollarSign,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Con Referido",
      value: cuentasConReferido.toString(),
      subtitle: `${((cuentasConReferido / totalCuentas) * 100).toFixed(0)}% del total`,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Investigadas",
      value: cuentasInvestigadas.toString(),
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Derecho ARCOS",
      value: cuentasSuprimidas.toString(),
      subtitle: "Suprimidas",
      icon: ShieldAlert,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="border-border/50 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">{kpi.title}</p>
              <p className="text-xl font-bold text-foreground mt-1">{kpi.value}</p>
              {kpi.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
