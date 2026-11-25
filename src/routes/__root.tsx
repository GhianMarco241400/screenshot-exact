import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { LayoutDashboard, RefreshCw, TriangleAlert } from "lucide-react";
import { MotionConfig } from "motion/react";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/app-shell";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { reportLovableError } from "../lib/lovable-error-reporting";

const themeScript = `(function(){try{var t=localStorage.getItem("smartmarket-theme");var d=t!=="light";var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){document.documentElement.classList.add("dark");}})();`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="surface-panel w-full max-w-md p-8 text-center">
        <p className="text-gradient font-display text-6xl font-bold tracking-tight">404</p>
        <h1 className="mt-4 font-display text-xl font-semibold text-foreground">
          Página no encontrada
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          La página que buscas no existe o fue movida a otra sección del panel.
        </p>
        <Button asChild className="mt-6" variant="brand">
          <Link to="/dashboard">
            <LayoutDashboard aria-hidden="true" />
            Volver al dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="surface-panel w-full max-w-md p-8 text-center">
        <span className="icon-chip mx-auto h-12 w-12">
          <TriangleAlert aria-hidden="true" className="h-5 w-5" />
        </span>
        <h1 className="mt-5 font-display text-xl font-semibold text-foreground">
          No pudimos cargar esta página
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Algo salió mal en el panel. Puedes reintentar o volver al dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            variant="brand"
          >
            <RefreshCw aria-hidden="true" />
            Reintentar
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">
              <LayoutDashboard aria-hidden="true" />
              Ir al dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Replace these placeholders with the app's name and description when first building the app.
    // Each content route, / included, must still set its own head(). Never add og:image or
    // twitter:image here: every page without its own would inherit the root's preview image.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SmartMarket AI | Demanda e inventario" },
      {
        name: "description",
        content: "Panel visual de ventas, demanda e inventario para un minimarket.",
      },
      { property: "og:title", content: "SmartMarket AI | Demanda e inventario" },
      {
        property: "og:description",
        content: "Panel visual de ventas, demanda e inventario para un minimarket.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html className="dark" lang="es" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div aria-hidden="true" className="app-backdrop" />
        <div className="relative z-10 min-h-screen">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // Required: nested routes render here. Removing <Outlet /> breaks all child routes.
  const outlet = <Outlet />;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <AuthProvider>
            {pathname === "/login" ? outlet : <AppShell>{outlet}</AppShell>}
          </AuthProvider>
        </MotionConfig>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
