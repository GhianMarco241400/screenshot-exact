import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Menu,
  PackageSearch,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/productos", label: "Productos", icon: Boxes },
  { to: "/ventas", label: "Ventas", icon: BarChart3 },
  { to: "/inventario", label: "Inventario", icon: ClipboardList },
  { to: "/prediccion", label: "Predicción", icon: Activity },
  { to: "/red-neuronal", label: "Red neuronal", icon: Sparkles },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const currentPath = useRouterState({ select: (router) => router.location.pathname });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 md:pl-[calc(var(--app-sidebar-width)+1.5rem)] lg:pr-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              aria-label={mobileNavOpen ? "Cerrar navegación" : "Abrir navegación"}
              className="md:hidden"
              onClick={() => setMobileNavOpen((open) => !open)}
              size="icon"
              variant="ghost"
            >
              {mobileNavOpen ? <X /> : <Menu />}
            </Button>
            <Link to="/dashboard" className="flex min-w-0 items-center gap-3 text-foreground">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <PackageSearch aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="truncate text-base font-semibold">SmartMarket AI</span>
            </Link>
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="h-2 w-2 rounded-full bg-status-good" />
            Datos de demostración
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-16 z-20 hidden w-[var(--app-sidebar-width)] flex-col border-r border-border bg-card md:flex">
        <div className="px-4 pb-3 pt-6">
          <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">Menú principal</p>
        </div>
        <nav aria-label="Navegación principal" className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const active = currentPath === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
                to={item.to}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-border px-6 py-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-status-good" />
            Inventario actualizado
          </div>
          <p className="mt-2">Moneda local · S/</p>
        </div>
      </aside>

      {mobileNavOpen ? (
        <nav
          aria-label="Navegación principal"
          className="absolute inset-x-0 top-16 z-20 grid grid-cols-2 gap-1 border-b border-border bg-card p-3 shadow-md md:hidden"
        >
          {navItems.map((item) => {
            const active = currentPath === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                }`}
                onClick={() => setMobileNavOpen(false)}
                to={item.to}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      ) : null}

      <main className="min-h-[calc(100vh-4rem)] md:ml-[var(--app-sidebar-width)]">
        <div className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}