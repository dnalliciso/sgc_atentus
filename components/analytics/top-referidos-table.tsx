"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal } from "lucide-react";
import type { UserAccount } from "@/lib/users-store";

interface TopReferidosTableProps {
  users: UserAccount[];
}

export function TopReferidosTable({ users }: TopReferidosTableProps) {
  const topReferidos = useMemo(() => {
    const referidoCount: Record<string, { nombre: string; email: string; count: number; totalAbonos: number }> = {};

    users.forEach((user) => {
      if (user.referido) {
        const key = user.referido.email;
        if (!referidoCount[key]) {
          referidoCount[key] = {
            nombre: user.referido.nombre,
            email: user.referido.email,
            count: 0,
            totalAbonos: 0,
          };
        }
        referidoCount[key].count += 1;
        referidoCount[key].totalAbonos += user.abonos.reduce((sum, a) => sum + a.monto, 0);
      }
    });

    return Object.values(referidoCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [users]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      notation: "compact",
    }).format(value);
  };

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-orange-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Referidores
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topReferidos.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay datos de referidos disponibles
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-center">Cuentas</TableHead>
                <TableHead className="text-right">Vol. Abonos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topReferidos.map((referido, index) => (
                <TableRow key={referido.email}>
                  <TableCell>
                    {index < 3 ? (
                      <Medal className={`w-5 h-5 ${getMedalColor(index)}`} />
                    ) : (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{referido.nombre}</p>
                      <p className="text-xs text-muted-foreground">{referido.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{referido.count}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {formatCurrency(referido.totalAbonos)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
