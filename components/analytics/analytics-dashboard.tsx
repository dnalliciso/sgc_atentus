"use client";

import { useState, useMemo } from "react";
import { getUsers } from "@/lib/users-store";
import { KpiCards } from "./kpi-cards";
import { StatusChart } from "./status-chart";
import { BankDistributionChart } from "./bank-distribution-chart";
import { AbonosTimelineChart } from "./abonos-timeline-chart";
import { ReferidosAnalysis } from "./referidos-analysis";
import { CountryDistribution } from "./country-distribution";
import { AccountTypeChart } from "./account-type-chart";
import { TopReferidosTable } from "./top-referidos-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<string>("all");
  const users = useMemo(() => getUsers(), []);

  // Calcular métricas principales
  const totalCuentas = users.length;
  const cuentasActivas = users.filter((u) => u.status === "activo").length;
  const cuentasInactivas = users.filter((u) => u.status === "inactivo").length;
  const cuentasDevueltas = users.filter((u) => u.status === "devuelto").length;
  const cuentasInvestigadas = users.filter((u) => u.status === "investigada").length;
  const cuentasSuprimidas = users.filter((u) => u.status === "suprimida_arcos").length;
  
  const totalAbonos = users.reduce(
    (sum, u) => sum + u.abonos.reduce((s, a) => s + a.monto, 0),
    0
  );
  
  const totalMantencion = users.reduce(
    (sum, u) => sum + u.bankDetails.costoMantencion,
    0
  );

  const cuentasConReferido = users.filter((u) => u.referido !== null).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analítica de Cuentas</h1>
          <p className="text-muted-foreground">
            Resumen completo del estado de las cuentas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo el tiempo</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs principales */}
      <KpiCards
        totalCuentas={totalCuentas}
        cuentasActivas={cuentasActivas}
        totalAbonos={totalAbonos}
        totalMantencion={totalMantencion}
        cuentasConReferido={cuentasConReferido}
        cuentasInvestigadas={cuentasInvestigadas}
        cuentasSuprimidas={cuentasSuprimidas}
      />

      {/* Gráficos de estado y distribución */}
      <div className="grid gap-6 md:grid-cols-2">
        <StatusChart
          activas={cuentasActivas}
          inactivas={cuentasInactivas}
          devueltas={cuentasDevueltas}
          investigadas={cuentasInvestigadas}
          suprimidas={cuentasSuprimidas}
        />
        <BankDistributionChart users={users} />
      </div>

      {/* Timeline de abonos */}
      <AbonosTimelineChart users={users} />

      {/* Análisis por país y tipo de cuenta */}
      <div className="grid gap-6 md:grid-cols-2">
        <CountryDistribution users={users} />
        <AccountTypeChart users={users} />
      </div>

      {/* Análisis de referidos */}
      <div className="grid gap-6 md:grid-cols-2">
        <ReferidosAnalysis users={users} cuentasConReferido={cuentasConReferido} />
        <TopReferidosTable users={users} />
      </div>

      {/* Resumen de estados críticos */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Resumen de Estados Críticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <p className="text-sm text-orange-400">Cuentas Devueltas</p>
              <p className="text-2xl font-bold text-orange-500">{cuentasDevueltas}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((cuentasDevueltas / totalCuentas) * 100).toFixed(1)}% del total
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-400">Cuentas Investigadas</p>
              <p className="text-2xl font-bold text-yellow-500">{cuentasInvestigadas}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((cuentasInvestigadas / totalCuentas) * 100).toFixed(1)}% del total
              </p>
            </div>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">Suprimidas ARCOS</p>
              <p className="text-2xl font-bold text-red-500">{cuentasSuprimidas}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((cuentasSuprimidas / totalCuentas) * 100).toFixed(1)}% del total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
