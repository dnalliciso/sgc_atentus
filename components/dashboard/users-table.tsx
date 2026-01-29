"use client";

import { useState, useMemo } from "react";
import useSWR, { mutate } from "swr";
import type { UserAccount } from "@/lib/users-store";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  EyeOff,
  Eye,
  UserCircle,
  Mail,
  Phone,
  Lock,
  AlertCircle,
  Filter,
  X,
} from "lucide-react";
import { UserDialog } from "./user-dialog";
import { DeleteDialog } from "./delete-dialog";
import { UserDetailDialog } from "./user-detail-dialog";

// Función para anonimizar texto
function anonymize(text: string, show: boolean): string {
  if (show) return text;
  if (!text) return "";
  return "••••••••";
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function UsersTable() {
  const { data: users = [] } = useSWR<UserAccount[]>("/api/users", fetcher);
  const { validateSecurityCode } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserAccount | null>(null);
  const [deleteUserData, setDeleteUserData] = useState<UserAccount | null>(null);
  const [detailUser, setDetailUser] = useState<UserAccount | null>(null);
  const [hideSensitiveData, setHideSensitiveData] = useState(true);
  const [referidoDialogUser, setReferidoDialogUser] = useState<UserAccount | null>(null);
  
  // Filtros
  const [filterBanco, setFilterBanco] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [filterPais, setFilterPais] = useState<string>("all");
  
  // Estado para validación de código
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [securityCode, setSecurityCode] = useState("");
  const [codeError, setCodeError] = useState("");

  // Obtener listas únicas para filtros
  const bancos = useMemo(() => {
    const uniqueBancos = [...new Set(users.map(u => u.bankDetails.banco))].filter(Boolean);
    return uniqueBancos.sort();
  }, [users]);

  const paises = useMemo(() => {
    const uniquePaises = [...new Set(users.map(u => u.pais))].filter(Boolean);
    return uniquePaises.sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bankDetails.banco.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBanco = filterBanco === "all" || user.bankDetails.banco === filterBanco;
      const matchesEstado = filterEstado === "all" || user.status === filterEstado;
      const matchesPais = filterPais === "all" || user.pais === filterPais;

      return matchesSearch && matchesBanco && matchesEstado && matchesPais;
    });
  }, [users, searchQuery, filterBanco, filterEstado, filterPais]);

  const hasActiveFilters = filterBanco !== "all" || filterEstado !== "all" || filterPais !== "all";

  const clearFilters = () => {
    setFilterBanco("all");
    setFilterEstado("all");
    setFilterPais("all");
  };

  const handleDelete = async () => {
    if (deleteUserData) {
      await fetch(`/api/users/${deleteUserData.id}`, { method: "DELETE" });
      mutate("/api/users");
      setDeleteUserData(null);
    }
  };

  const handleShowDataClick = () => {
    if (hideSensitiveData) {
      setShowCodeDialog(true);
      setSecurityCode("");
      setCodeError("");
    } else {
      setHideSensitiveData(true);
    }
  };

  const handleCodeSubmit = () => {
    if (validateSecurityCode(securityCode)) {
      setHideSensitiveData(false);
      setShowCodeDialog(false);
      setSecurityCode("");
      setCodeError("");
    } else {
      setCodeError("Código de seguridad incorrecto");
    }
  };

  const getStatusBadge = (status: UserAccount["status"]) => {
    const variants: Record<UserAccount["status"], string> = {
      activo: "bg-success/10 text-success border-success/20",
      inactivo: "bg-muted text-muted-foreground border-border",
      devuelto: "bg-warning/10 text-warning border-warning/20",
      investigada: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      suprimida_arcos: "bg-destructive/10 text-destructive border-destructive/20",
    };

    const labels: Record<UserAccount["status"], string> = {
      activo: "Activo",
      inactivo: "Inactivo",
      devuelto: "Devuelto",
      investigada: "Investigada",
      suprimida_arcos: "Suprimida ARCOS",
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <>
      <Card className="border-border/50">
        <CardHeader className="pb-4 space-y-4">
          {/* Fila de búsqueda y botones */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o banco..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleShowDataClick}
                className={hideSensitiveData ? "" : "bg-warning/10 border-warning/30 text-warning hover:bg-warning/20"}
              >
                {hideSensitiveData ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Mostrar datos
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Ocultar datos
                  </>
                )}
              </Button>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>
          </div>

          {/* Fila de filtros */}
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
                <X className="w-4 h-4 mr-1" />
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Nombre</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Teléfono</TableHead>
                  <TableHead className="text-muted-foreground">Banco</TableHead>
                  <TableHead className="text-muted-foreground">País</TableHead>
                  <TableHead className="text-muted-foreground">Estado</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">
                    Fecha de Ingreso
                  </TableHead>
                  <TableHead className="text-muted-foreground">Referido</TableHead>
                  <TableHead className="text-muted-foreground w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No se encontraron usuarios</p>
                      <p className="text-sm">
                        {hasActiveFilters 
                          ? "Intenta ajustando los filtros" 
                          : "Intenta con otros términos de búsqueda"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-border/50 hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {hideSensitiveData ? (
                          <span className="text-muted-foreground cursor-not-allowed">
                            {anonymize(user.name, false)}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDetailUser(user)}
                            className="text-foreground hover:text-primary hover:underline transition-colors text-left"
                          >
                            {user.name}
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {anonymize(user.email, !hideSensitiveData)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {anonymize(user.telefono, !hideSensitiveData)}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {user.bankDetails.banco}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.pais}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {user.fechaIngreso}
                      </TableCell>
                      <TableCell>
                        {user.referido ? (
                          hideSensitiveData ? (
                            <span className="text-muted-foreground text-sm cursor-not-allowed">
                              Bloqueado
                            </span>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReferidoDialogUser(user)}
                              className="text-xs"
                            >
                              Ver referido
                            </Button>
                          )
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin referido</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {hideSensitiveData ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-not-allowed opacity-50"
                            disabled
                          >
                            <MoreHorizontal className="w-4 h-4" />
                            <span className="sr-only">Acciones bloqueadas</span>
                          </Button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                                <span className="sr-only">Abrir menú</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditUser(user)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteUserData(user)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
      />

      <UserDialog
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        mode="edit"
        user={editUser || undefined}
      />

      <DeleteDialog
        open={!!deleteUserData}
        onOpenChange={(open) => !open && setDeleteUserData(null)}
        onConfirm={handleDelete}
        userName={deleteUserData?.name || ""}
      />

      <UserDetailDialog
        open={!!detailUser}
        onOpenChange={(open) => !open && setDetailUser(null)}
        user={detailUser}
        hideSensitiveData={hideSensitiveData}
      />

      {/* Dialog de Referido */}
      <Dialog open={!!referidoDialogUser} onOpenChange={(open) => !open && setReferidoDialogUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Contacto Referido
            </DialogTitle>
          </DialogHeader>
          {referidoDialogUser?.referido && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Nombre</p>
                  <p className="font-medium text-foreground">{referidoDialogUser.referido.nombre}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{referidoDialogUser.referido.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="font-medium text-foreground">{referidoDialogUser.referido.telefono}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para ingresar código de seguridad */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Verificación de Seguridad
            </DialogTitle>
            <DialogDescription>
              Ingresa tu código de seguridad de 6 dígitos para ver los datos sensibles
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="security-code">Código de seguridad</Label>
              <Input
                id="security-code"
                type="password"
                maxLength={6}
                value={securityCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setSecurityCode(value);
                  setCodeError("");
                }}
                placeholder="••••••"
                className={`text-center text-2xl tracking-[0.5em] ${codeError ? "border-destructive" : ""}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && securityCode.length === 6) {
                    handleCodeSubmit();
                  }
                }}
              />
              {codeError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {codeError}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCodeDialog(false);
                setSecurityCode("");
                setCodeError("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCodeSubmit}
              disabled={securityCode.length !== 6}
            >
              Verificar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
