export interface Abono {
  id: string;
  fecha: string;
  monto: number;
  motivo: string;
}

export interface BankDetails {
  banco: string;
  tipoCuenta: "corriente" | "vista" | "fan" | "inversiones" | "credito";
  rut: string;
  claveWeb: string;
  numeroCuenta: string;
  costoMantencion: number;
}

export interface Referido {
  nombre: string;
  email: string;
  telefono: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "titular";
  status: "activo" | "inactivo" | "devuelto" | "investigada" | "suprimida_arcos";
  createdAt: string;
  fechaIngreso: string;
  telefono: string;
  pais: string;
  referido: Referido | null;
  bankDetails: BankDetails;
  abonos: Abono[];
}

// Datos iniciales de ejemplo (también se usarán para inicializar SQLite)
export const initialUsers: UserAccount[] = [
  {
    id: "1",
    name: "Daniel Nalli",
    email: "dnalli@atentus.com",
    role: "titular",
    status: "activo",
    createdAt: "2024-01-15",
    fechaIngreso: "2024-01-15",
    telefono: "+56 9 1234 5678",
    pais: "Chile",
    referido: {
      nombre: "Roberto Sánchez",
      email: "rsanchez@empresa.com",
      telefono: "+56 9 8765 4321",
    },
    bankDetails: {
      banco: "Banco de Chile",
      tipoCuenta: "corriente",
      rut: "12.345.678-9",
      claveWeb: "Clave1234!",
      numeroCuenta: "00-123-45678-90",
      costoMantencion: 5990,
    },
    abonos: [
      { id: "a1", fecha: "2025-01-25", monto: 1500000, motivo: "Sueldo mensual" },
      { id: "a2", fecha: "2025-01-15", monto: 250000, motivo: "Bono trimestral" },
      { id: "a3", fecha: "2024-12-25", monto: 1500000, motivo: "Sueldo mensual" },
      { id: "a4", fecha: "2024-12-15", monto: 800000, motivo: "Aguinaldo" },
    ],
  },
  {
    id: "2",
    name: "María García",
    email: "mgarcia@atentus.com",
    role: "titular",
    status: "activo",
    createdAt: "2024-02-20",
    fechaIngreso: "2024-02-20",
    telefono: "+56 9 2345 6789",
    pais: "Chile",
    referido: {
      nombre: "Laura Mendoza",
      email: "lmendoza@empresa.com",
      telefono: "+56 9 7654 3210",
    },
    bankDetails: {
      banco: "Banco Santander",
      tipoCuenta: "vista",
      rut: "15.678.901-2",
      claveWeb: "Maria2024#",
      numeroCuenta: "00-456-78901-23",
      costoMantencion: 0,
    },
    abonos: [
      { id: "b1", fecha: "2025-01-20", monto: 950000, motivo: "Sueldo mensual" },
      { id: "b2", fecha: "2024-12-20", monto: 950000, motivo: "Sueldo mensual" },
      { id: "b3", fecha: "2024-11-20", monto: 950000, motivo: "Sueldo mensual" },
    ],
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "crodriguez@atentus.com",
    role: "titular",
    status: "inactivo",
    createdAt: "2024-03-10",
    fechaIngreso: "2024-03-10",
    telefono: "+56 9 3456 7890",
    pais: "Chile",
    referido: null,
    bankDetails: {
      banco: "BCI",
      tipoCuenta: "corriente",
      rut: "18.234.567-K",
      claveWeb: "Carlos#2024",
      numeroCuenta: "00-789-01234-56",
      costoMantencion: 4500,
    },
    abonos: [
      { id: "c1", fecha: "2025-01-05", monto: 1200000, motivo: "Sueldo mensual" },
      { id: "c2", fecha: "2024-12-05", monto: 1200000, motivo: "Sueldo mensual" },
    ],
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "amartinez@atentus.com",
    role: "titular",
    status: "devuelto",
    createdAt: "2024-06-01",
    fechaIngreso: "2024-06-01",
    telefono: "+56 9 4567 8901",
    pais: "Argentina",
    referido: {
      nombre: "Pablo Torres",
      email: "ptorres@empresa.com",
      telefono: "+54 9 1122 3344",
    },
    bankDetails: {
      banco: "Banco Estado",
      tipoCuenta: "fan",
      rut: "19.876.543-2",
      claveWeb: "Ana!Segura99",
      numeroCuenta: "19876543-2",
      costoMantencion: 0,
    },
    abonos: [],
  },
  {
    id: "5",
    name: "Pedro López",
    email: "plopez@atentus.com",
    role: "titular",
    status: "investigada",
    createdAt: "2024-07-15",
    fechaIngreso: "2024-07-15",
    telefono: "+56 9 5678 9012",
    pais: "Chile",
    referido: {
      nombre: "Carmen Vega",
      email: "cvega@empresa.com",
      telefono: "+56 9 6543 2109",
    },
    bankDetails: {
      banco: "Banco Itaú",
      tipoCuenta: "inversiones",
      rut: "16.543.210-5",
      claveWeb: "Pedro$2025",
      numeroCuenta: "00-321-65432-10",
      costoMantencion: 6500,
    },
    abonos: [
      { id: "d1", fecha: "2025-01-22", monto: 1800000, motivo: "Sueldo mensual" },
      { id: "d2", fecha: "2025-01-10", monto: 500000, motivo: "Comisión ventas" },
      { id: "d3", fecha: "2024-12-22", monto: 1800000, motivo: "Sueldo mensual" },
      { id: "d4", fecha: "2024-12-15", monto: 350000, motivo: "Bono navidad" },
      { id: "d5", fecha: "2024-11-22", monto: 1800000, motivo: "Sueldo mensual" },
    ],
  },
  {
    id: "6",
    name: "Lucía Fernández",
    email: "lfernandez@atentus.com",
    role: "titular",
    status: "suprimida_arcos",
    createdAt: "2024-08-20",
    fechaIngreso: "2024-08-20",
    telefono: "+56 9 6789 0123",
    pais: "Perú",
    referido: null,
    bankDetails: {
      banco: "Banco Falabella",
      tipoCuenta: "credito",
      rut: "20.123.456-7",
      claveWeb: "Lucia@Pass1",
      numeroCuenta: "00-555-12345-67",
      costoMantencion: 3500,
    },
    abonos: [
      { id: "e1", fecha: "2025-01-18", monto: 750000, motivo: "Sueldo mensual" },
    ],
  },
];

// Store simple en memoria
let users: UserAccount[] = [...initialUsers];

export function getUsers(): UserAccount[] {
  return [...users];
}

export function getUserById(id: string): UserAccount | undefined {
  return users.find((u) => u.id === id);
}

export function addUser(
  user: Omit<UserAccount, "id" | "createdAt" | "bankDetails" | "abonos">
): UserAccount {
  const today = new Date().toISOString().split("T")[0];
  const newUser: UserAccount = {
    ...user,
    id: Date.now().toString(),
    createdAt: today,
    bankDetails: {
      banco: "",
      tipoCuenta: "corriente",
      rut: "",
      claveWeb: "",
      numeroCuenta: "",
      costoMantencion: 0,
    },
    abonos: [],
  };
  users = [...users, newUser];
  return newUser;
}

export function updateUser(
  id: string,
  updates: Partial<Omit<UserAccount, "id">>
): UserAccount | null {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  return users[index];
}

export function deleteUser(id: string): boolean {
  const initialLength = users.length;
  users = users.filter((u) => u.id !== id);
  return users.length < initialLength;
}
