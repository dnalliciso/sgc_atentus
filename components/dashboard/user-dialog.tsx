"use client";

import React from "react";

import { useState, useEffect } from "react";
import { mutate } from "swr";
import { addUser, updateUser, type UserAccount } from "@/lib/users-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user?: UserAccount;
}

export function UserDialog({
  open,
  onOpenChange,
  mode,
  user,
}: UserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("Chile");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [status, setStatus] = useState<UserAccount["status"]>("activo");
  const [referidoNombre, setReferidoNombre] = useState("");
  const [referidoEmail, setReferidoEmail] = useState("");
  const [referidoTelefono, setReferidoTelefono] = useState("");

  useEffect(() => {
    if (user && mode === "edit") {
      setName(user.name);
      setEmail(user.email);
      setTelefono(user.telefono);
      setPais(user.pais);
      setFechaIngreso(user.fechaIngreso);
      setStatus(user.status);
      setReferidoNombre(user.referido?.nombre || "");
      setReferidoEmail(user.referido?.email || "");
      setReferidoTelefono(user.referido?.telefono || "");
    } else {
      setName("");
      setEmail("");
      setTelefono("");
      setPais("Chile");
      setFechaIngreso(new Date().toISOString().split("T")[0]);
      setStatus("activo");
      setReferidoNombre("");
      setReferidoEmail("");
      setReferidoTelefono("");
    }
  }, [user, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const referido =
      referidoNombre || referidoEmail || referidoTelefono
        ? {
            nombre: referidoNombre,
            email: referidoEmail,
            telefono: referidoTelefono,
          }
        : null;

    if (mode === "create") {
      addUser({
        name,
        email,
        role: "titular",
        status,
        telefono,
        pais,
        fechaIngreso,
        referido,
      });
    } else if (user) {
      updateUser(user.id, {
        name,
        email,
        status,
        telefono,
        pais,
        fechaIngreso,
        referido,
      });
    }

    mutate("users");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Crear nuevo usuario" : "Editar usuario"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los datos para crear una nueva cuenta de usuario."
              : "Modifica los datos del usuario seleccionado."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@ejemplo.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono contacto</Label>
              <Input
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais">País</Label>
              <Select value={pais} onValueChange={setPais}>
                <SelectTrigger id="pais">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chile">Chile</SelectItem>
                  <SelectItem value="Argentina">Argentina</SelectItem>
                  <SelectItem value="Perú">Perú</SelectItem>
                  <SelectItem value="Colombia">Colombia</SelectItem>
                  <SelectItem value="México">México</SelectItem>
                  <SelectItem value="Brasil">Brasil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
              <Input
                id="fechaIngreso"
                type="date"
                value={fechaIngreso}
                onChange={(e) => setFechaIngreso(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as UserAccount["status"])}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="devuelto">Devuelto</SelectItem>
                  <SelectItem value="investigada">Investigada</SelectItem>
                  <SelectItem value="suprimida_arcos">Suprimida ARCOS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Datos del Referido */}
          <div className="pt-4 border-t border-border">
            <Label className="text-sm font-medium">Contacto Referido (opcional)</Label>
            <div className="mt-3 space-y-3">
              <Input
                value={referidoNombre}
                onChange={(e) => setReferidoNombre(e.target.value)}
                placeholder="Nombre del referido"
              />
              <Input
                type="email"
                value={referidoEmail}
                onChange={(e) => setReferidoEmail(e.target.value)}
                placeholder="Email del referido"
              />
              <Input
                value={referidoTelefono}
                onChange={(e) => setReferidoTelefono(e.target.value)}
                placeholder="Teléfono del referido"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {mode === "create" ? "Crear usuario" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
