import { isRedirect } from "@tanstack/react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEMO_SESSION_KEY,
  clearDemoSession,
  hasDemoSession,
  requireSession,
  setDemoSession,
} from "@/lib/demo-auth";

function captureRedirect(action: () => void): unknown {
  try {
    action();
  } catch (error) {
    return error;
  }
  return null;
}

describe("Sesión simulada de demostración", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.sessionStorage.clear();
  });

  it("empieza sin sesión y solo guarda un flag al iniciar", () => {
    expect(hasDemoSession()).toBe(false);
    expect(window.sessionStorage.getItem(DEMO_SESSION_KEY)).toBeNull();

    setDemoSession();

    expect(hasDemoSession()).toBe(true);
    expect(window.sessionStorage.getItem(DEMO_SESSION_KEY)).toBe("active");
  });

  it("borra el flag al cerrar sesión", () => {
    setDemoSession();
    expect(hasDemoSession()).toBe(true);

    clearDemoSession();

    expect(hasDemoSession()).toBe(false);
    expect(window.sessionStorage.getItem(DEMO_SESSION_KEY)).toBeNull();
  });

  it("redirige a /login cuando no hay sesión", () => {
    const error = captureRedirect(requireSession);

    expect(isRedirect(error)).toBe(true);
    expect((error as { options?: { to?: string } }).options?.to).toBe("/login");
  });

  it("no redirige cuando hay sesión", () => {
    setDemoSession();

    expect(captureRedirect(requireSession)).toBeNull();
  });

  it("tolera sessionStorage bloqueado", () => {
    const blocked = () => {
      throw new Error("Almacenamiento bloqueado");
    };
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(blocked);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(blocked);
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(blocked);

    expect(hasDemoSession()).toBe(false);
    expect(() => setDemoSession()).not.toThrow();
    expect(() => clearDemoSession()).not.toThrow();
    expect(isRedirect(captureRedirect(requireSession))).toBe(true);
  });
});
