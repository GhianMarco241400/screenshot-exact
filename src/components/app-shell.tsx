import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Activity,
  BarChart3,
  Boxes,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { PageTransition } from "@/components/page-transition";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/productos", label: "Productos", icon: Boxes },
  { to: "/ventas", label: "Ventas", icon: BarChart3 },
  { to: "/inventario", label: "Inventario", icon: ClipboardList },
  { to: "/prediccion", label: "Predicción", icon: Activity },
  { to: "/red-neuronal", label: "Red neuronal", icon: Sparkles },
] as const;

function HeaderSearch({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        aria-label="Buscar en el panel (demostración)"
        className="h-10 w-full rounded-full border border-border/60 bg-card/50 pl-10 pr-14 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/25"
        placeholder="Buscar productos, ventas…"
        type="search"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border/70 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        ⌘K
      </kbd>
    </div>
  );
}

function SidebarLink({ item, active }: { item: (typeof navItems)[number]; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "nav-active text-foreground"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
      to={item.to}
    >
      {active ? (
        <span
          aria-hidden="true"
          className="nav-active-bar absolute inset-y-2 left-0 w-[3px] rounded-full"
        />
      ) : null}
      <Icon
        aria-hidden="true"
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          active ? "text-ai" : "group-hover:text-foreground",
        )}
      />
      <span className="truncate">{item.label}</span>
      {active ? (
        <ChevronRight aria-hidden="true" className="ml-auto h-3.5 w-3.5 text-primary" />
      ) : null}
    </Link>
  );
}

function ModelCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-primary/25 p-3.5",
        compact ? "" : "bg-card/30",
      )}
      style={{
        backgroundImage: compact
          ? "linear-gradient(140deg, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)"
          : "linear-gradient(150deg, color-mix(in oklab, var(--primary) 18%, transparent), color-mix(in oklab, var(--ai) 8%, transparent))",
      }}
    >
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-ai" />
        Modelo
      </div>
      <p className="mt-1.5 font-display text-sm font-semibold text-foreground">
        Simulación educativa
      </p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        Sin datos reales ni modelo entrenado.
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const currentPath = useRouterState({ select: (router) => router.location.pathname });
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 sm:px-6 md:pl-[calc(var(--app-sidebar-width)+1.5rem)] lg:pr-8">
          <div className="flex min-w-0 items-center gap-2 md:hidden">
            <Button
              aria-label={mobileNavOpen ? "Cerrar navegación" : "Abrir navegación"}
              className="rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => setMobileNavOpen((open) => !open)}
              size="icon"
              variant="ghost"
            >
              {mobileNavOpen ? <X /> : <Menu />}
            </Button>
            <Link className="flex min-w-0 items-center gap-2.5" to="/dashboard">
              <BrandLogo className="h-9 w-9 rounded-lg" />
              <span className="truncate font-display text-sm font-semibold tracking-tight text-foreground">
                SmartMarket AI
              </span>
            </Link>
          </div>

          <div className="hidden min-w-0 flex-1 md:block">
            <HeaderSearch className="max-w-md" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-ai/30 bg-ai/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ai lg:inline-flex">
              <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ai opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ai" />
              </span>
              Primera entrega
            </span>
            <ThemeToggle />
            <span aria-hidden="true" className="mx-1 hidden h-6 w-px bg-border/70 sm:block" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Cuenta de demostración"
                  className="avatar-ring rounded-full p-[2px] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  title="Cuenta de demostración"
                  type="button"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-[11px] font-semibold text-foreground">
                    SM
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <span className="block text-sm font-semibold text-foreground">Marco</span>
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    Administrador (demo)
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    logout();
                    void navigate({ to: "/login" });
                  }}
                >
                  <LogOut aria-hidden="true" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-[var(--app-sidebar-width)] flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-2xl md:flex">
        <div className="flex items-center gap-3 px-5 pb-4 pt-5">
          <BrandLogo />
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold tracking-tight text-foreground">
              SmartMarket AI
            </p>
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Retail intelligence
            </p>
          </div>
        </div>

        <nav
          aria-label="Navegación principal"
          className="scroll-slim flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-3"
        >
          <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Menú principal
          </p>
          {navItems.map((item) => (
            <SidebarLink active={currentPath === item.to} item={item} key={item.to} />
          ))}
        </nav>

        <div className="space-y-3 p-3">
          <ModelCard />
          <div className="flex items-center justify-between px-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-status-good" />
              Demo activa
            </span>
            <span>S/ · PEN</span>
          </div>
        </div>
      </aside>

      {mobileNavOpen ? (
        <motion.nav
          animate={{ opacity: 1, y: 0 }}
          aria-label="Navegación principal"
          className="absolute inset-x-0 top-16 z-20 border-b border-border/60 bg-background/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
          initial={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <HeaderSearch />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const active = currentPath === item.to;
              const Icon = item.icon;
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-2 rounded-lg border border-border/60 px-3 text-sm font-medium transition-colors",
                    active
                      ? "nav-active border-primary/30 text-foreground"
                      : "bg-card/40 text-muted-foreground hover:text-foreground",
                  )}
                  key={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  to={item.to}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn("h-4 w-4 shrink-0", active && "text-ai")}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="mt-3">
            <ModelCard compact />
          </div>
        </motion.nav>
      ) : null}

      <main className="min-h-[calc(100vh-4rem)] md:ml-[var(--app-sidebar-width)]">
        <div className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>

      <Toaster closeButton position="bottom-right" richColors theme={theme} />
    </div>
  );
}
