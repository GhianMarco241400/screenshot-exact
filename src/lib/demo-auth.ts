import { redirect } from "@tanstack/react-router";

/**
 * Autenticación ficticia para la demo: solo guarda un flag en sessionStorage.
 * No valida identidades, no guarda contraseñas y no es seguridad real.
 */
export const DEMO_SESSION_KEY = "smartmarket-demo-session";

export const demoCredentials = {
  email: "demo@smartmarket.ai",
  password: "demo1234",
} as const;

const SESSION_VALUE = "active";

export function hasDemoSession(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(DEMO_SESSION_KEY) === SESSION_VALUE;
  } catch {
    return false;
  }
}

export function setDemoSession(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(DEMO_SESSION_KEY, SESSION_VALUE);
  } catch {
    // Almacenamiento bloqueado: la demo sigue funcionando en memoria.
  }
}

export function clearDemoSession(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(DEMO_SESSION_KEY);
  } catch {
    // Almacenamiento bloqueado: no hay nada que limpiar.
  }
}

/** Protección del lado del cliente; cualquier usuario puede omitirla. */
export function requireSession(): void {
  if (!hasDemoSession()) {
    throw redirect({ to: "/login" });
  }
}
