"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import type { UserAccount } from "@/lib/users-store";
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
import { Button } from "@/components/ui/button";
import { CalendarDays, Filter } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<string>("all");
  const [filterBanco, setFilterBanco] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [filterPais, setFilterPais] = useState<string>("all");

  const { data: users = [] } = useSWR<UserAccount[]>("/api/users", fetcher);

  // Listas únicas para filtros
  const bancos = useMemo(() => {
    const uniqueBancos = [...new Set(users.map((u) => u.bankDetails.banco))].filter(Boolean);
    return uniqueBancos.sort();
  }, [users]);

  const paises = useMemo(() => {
    const uniquePaises = [...new Set(users.map((u) => u.pais))].filter(Boolean);
    return uniquePaises.sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesBanco = filterBanco === "all" || user.bankDetails.banco === filterBanco;
      const matchesEstado = filterEstado === "all" || user.status === filterEstado;
      const matchesPais = filterPais === "all" || user.pais === filterPais;

      return matchesBanco && matchesEstado && matchesPais;
    });
  }, [users, filterBanco, filterEstado, filterPais]);

  const hasActiveFilters =
    filterBanco !== "all" || filterEstado !== "all" || filterPais !== "all";

  const clearFilters = () => {
    setFilterBanco("all");
    setFilterEstado("all");
    setFilterPais("all");
  };

  // Calcular métricas principales sobre los usuarios filtrados
  const totalCuentas = filteredUsers.length;
  const cuentasActivas = filteredUsers.filter((u) => u.status === "activo").length;
  const cuentasInactivas = filteredUsers.filter((u) => u.status === "inactivo").length;
  const cuentasDevueltas = filteredUsers.filter((u) => u.status === "devuelto").length;
  const cuentasInvestigadas = filteredUsers.filter((u) => u.status === "investigada").length;
  const cuentasSuprimidas = filteredUsers.filter((u) => u.status === "suprimida_arcos").length;
  
  const totalAbonos = filteredUsers.reduce(
    (sum, u) => sum + u.abonos.reduce((s, a) => s + a.monto, 0),
    0
  );
  
  const totalMantencion = filteredUsers.reduce(
    (sum, u) => sum + u.bankDetails.costoMantencion,
    0
  );

  const cuentasConReferido = filteredUsers.filter((u) => u.referido !== null).length;

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

      {/* Filtros por banco, estado y país */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>Filtros:</span>
        </div>

        <Select value={filterBanco} onValueChange={setFilterBanco}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Banco" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los bancos</SelectItem>
            {bancos.map((banco) => (
              <SelectItem key={banco} value={banco}>
                {banco}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
            <SelectItem value="devuelto">Devuelto</SelectItem>
            <SelectItem value="investigada">Investigada</SelectItem>
            <SelectItem value="suprimida_arcos">Suprimida ARCOS</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPais} onValueChange={setFilterPais}>
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="País" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los países</SelectItem>
            {paises.map((pais) => (
              <SelectItem key={pais} value={pais}>
                {pais}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 text-muted-foreground hover:text-foreground"
          >
            Limpiar filtros
          </Button>
        )}
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
        <BankDistributionChart users={filteredUsers} />
      </div>

      {/* Timeline de abonos */}
      <AbonosTimelineChart users={filteredUsers} />

      {/* Análisis por país y tipo de cuenta */}
      <div className="grid gap-6 md:grid-cols-2">
        <CountryDistribution users={filteredUsers} />
        <AccountTypeChart users={filteredUsers} />
      </div>

      {/* Análisis de referidos */}
      <div className="grid gap-6 md:grid-cols-2">
        <ReferidosAnalysis users={filteredUsers} cuentasConReferido={cuentasConReferido} />
        <TopReferidosTable users={filteredUsers} />
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
