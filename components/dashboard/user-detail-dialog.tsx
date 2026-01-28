"use client";

import { type UserAccount } from "@/lib/users-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Building2,
  CreditCard,
  User,
  KeyRound,
  Hash,
  DollarSign,
  TrendingUp,
  EyeOff,
} from "lucide-react";

interface UserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserAccount | null;
  hideSensitiveData?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function maskData(data: string, hidden: boolean): string {
  if (!hidden || !data) return data;
  return "••••••••";
}

const tipoCuentaLabels: Record<string, string> = {
  corriente: "Cuenta Corriente",
  vista: "Cuenta Vista",
  fan: "Cuenta FAN",
  inversiones: "Cuenta Inversiones",
  credito: "Cuenta Crédito",
};

export function UserDetailDialog({
  open,
  onOpenChange,
  user,
  hideSensitiveData = false,
}: UserDetailDialogProps) {
  if (!user) return null;

  const { bankDetails, abonos } = user;

  const totalAbonos = abonos.reduce((sum, abono) => sum + abono.monto, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-foreground">{user.name}</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                  Titular
                </Badge>
                {hideSensitiveData && (
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Datos ocultos
                  </Badge>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Información Bancaria */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Información Bancaria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3 w-3" />
                    Banco
                  </p>
                  <p className="font-medium text-foreground">
                    {bankDetails.banco || "No especificado"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="h-3 w-3" />
                    Tipo de Cuenta
                  </p>
                  <p className="font-medium text-foreground">
                    {tipoCuentaLabels[bankDetails.tipoCuenta] || "No especificado"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    RUT
                  </p>
                  <p className={`font-medium font-mono ${hideSensitiveData ? "text-muted-foreground" : "text-foreground"}`}>
                    {maskData(bankDetails.rut, hideSensitiveData) || "No especificado"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <KeyRound className="h-3 w-3" />
                    Clave Web
                  </p>
                  <p className={`font-medium font-mono ${hideSensitiveData ? "text-muted-foreground" : "text-foreground"}`}>
                    {maskData(bankDetails.claveWeb, hideSensitiveData) || "No especificado"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Hash className="h-3 w-3" />
                    Número de Cuenta
                  </p>
                  <p className={`font-medium font-mono ${hideSensitiveData ? "text-muted-foreground" : "text-foreground"}`}>
                    {maskData(bankDetails.numeroCuenta, hideSensitiveData) || "No especificado"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3 w-3" />
                    Costo Mantención
                  </p>
                  <p className="font-medium text-foreground">
                    {bankDetails.costoMantencion > 0
                      ? formatCurrency(bankDetails.costoMantencion)
                      : "Sin costo"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    Nombre Titular
                  </p>
                  <p className="font-medium text-foreground">{user.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historial de Abonos */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Últimos Abonos
                </CardTitle>
                {abonos.length > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    Total: {formatCurrency(totalAbonos)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {abonos.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>No hay abonos registrados</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="text-muted-foreground">
                          Fecha
                        </TableHead>
                        <TableHead className="text-muted-foreground text-right">
                          Abono $
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Motivo
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {abonos.map((abono) => (
                        <TableRow
                          key={abono.id}
                          className="border-border/50 hover:bg-muted/50"
                        >
                          <TableCell className="text-muted-foreground">
                            {formatDate(abono.fecha)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-success font-mono">
                            +{formatCurrency(abono.monto)}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {abono.motivo}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
