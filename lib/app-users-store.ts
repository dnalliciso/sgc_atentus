// Store para usuarios de la aplicación (creados por el admin)

export interface AppUser {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  codigoSeguridad: string; // 6 dígitos
  password: string;
  activo: boolean;
  createdAt: string;
}

// Datos iniciales - usuario por defecto
const initialAppUsers: AppUser[] = [
  {
    id: "user-1",
    nombre: "Daniel",
    apellido: "Nalli",
    email: "dnalli@atentus.com",
    telefono: "+56 9 1234 5678",
    codigoSeguridad: "654321",
    password: "Samantha1.2",
    activo: true,
    createdAt: "2024-01-15",
  },
];

let appUsers: AppUser[] = [...initialAppUsers];

export function getAppUsers(): AppUser[] {
  return [...appUsers];
}

export function getAppUserById(id: string): AppUser | undefined {
  return appUsers.find((u) => u.id === id);
}

export function addAppUser(
  user: Omit<AppUser, "id" | "createdAt" | "activo">
): AppUser {
  const newUser: AppUser = {
    ...user,
    id: `user-${Date.now()}`,
    activo: true,
    createdAt: new Date().toISOString().split("T")[0],
  };
  appUsers = [...appUsers, newUser];
  return newUser;
}

export function updateAppUser(
  id: string,
  updates: Partial<Omit<AppUser, "id" | "createdAt">>
): AppUser | null {
  const index = appUsers.findIndex((u) => u.id === id);
  if (index === -1) return null;

  appUsers[index] = { ...appUsers[index], ...updates };
  return appUsers[index];
}

export function deleteAppUser(id: string): boolean {
  const initialLength = appUsers.length;
  appUsers = appUsers.filter((u) => u.id !== id);
  return appUsers.length < initialLength;
}

export function toggleAppUserStatus(id: string): AppUser | null {
  const index = appUsers.findIndex((u) => u.id === id);
  if (index === -1) return null;

  appUsers[index] = { ...appUsers[index], activo: !appUsers[index].activo };
  return appUsers[index];
}
