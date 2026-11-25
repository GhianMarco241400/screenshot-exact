import { useEffect, useRef, useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  WandSparkles,
} from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { LoginNeuralArt } from "@/components/login-neural-art";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { demoCredentials, hasDemoSession } from "@/lib/demo-auth";
import { pageMeta } from "@/lib/page-meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (hasDemoSession()) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () =>
    pageMeta(
      "Iniciar sesión | SmartMarket AI",
      "Acceso simulado de demostración al panel visual de ventas, demanda e inventario.",
    ),
  component: LoginPage,
});

const valuePoints = [
  {
    icon: Sparkles,
    title: "Predicción de demanda",
    description: "Estima las unidades de mañana con una red educativa.",
  },
  {
    icon: Boxes,
    title: "Control de inventario",
    description: "Visualiza existencias, mínimos y cobertura en un solo lugar.",
  },
  {
    icon: ClipboardList,
    title: "Reposición inteligente",
    description: "Prioriza productos y simula órdenes sin contactar proveedores.",
  },
] as const;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const reduceMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const signIn = async (correo: string, contraseña: string) => {
    if (busy || autoFilling) return;

    setError("");
    const validCredentials =
      correo.trim().toLowerCase() === demoCredentials.email &&
      contraseña === demoCredentials.password;

    if (!validCredentials) {
      setError("Correo o contraseña incorrectos. Usa la cuenta demo");
      return;
    }

    setBusy(true);
    await wait(1000);

    if (!mountedRef.current) return;

    login();
    void navigate({ to: "/dashboard", replace: true });
  };

  const typeCredentials = async (setter: (value: string) => void, value: string, delay: number) => {
    for (let index = 1; index <= value.length; index += 1) {
      if (!mountedRef.current) return false;
      setter(value.slice(0, index));
      await wait(delay);
    }
    return true;
  };

  const enterDemo = async () => {
    if (busy || autoFilling) return;

    setAutoFilling(true);
    setError("");

    if (!reduceMotion) {
      const emailReady = await typeCredentials(setEmail, demoCredentials.email, 18);
      if (!emailReady) return;
      await wait(100);
      const passwordReady = await typeCredentials(setPassword, demoCredentials.password, 28);
      if (!passwordReady) return;
    } else {
      setEmail(demoCredentials.email);
      setPassword(demoCredentials.password);
    }

    setAutoFilling(false);
    await signIn(demoCredentials.email, demoCredentials.password);
  };

  const disabled = busy || autoFilling;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <motion.section
          animate={{ opacity: 1, x: 0 }}
          className="relative isolate flex min-h-[440px] flex-col justify-between overflow-hidden px-6 py-10 text-white sm:px-10 lg:min-h-screen lg:px-12 lg:py-14"
          initial={reduceMotion ? false : { opacity: 0, x: -24 }}
          style={{
            backgroundImage: "linear-gradient(135deg, #312e81 0%, #6d28d9 48%, #0f172a 100%)",
          }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-4 h-72 w-72 rounded-full bg-indigo-400/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-sky-500/25 blur-3xl"
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-11 w-11 rounded-xl" />
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold tracking-tight">
                  SmartMarket AI
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
                  Retail intelligence
                </p>
              </div>
            </div>

            <p className="mt-12 max-w-lg font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              <span className="block">Predice la demanda.</span>
              <span className="block text-gradient">Repone a tiempo.</span>
            </p>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
              Un panel visual para entender tu minimarket: ventas, inventario y decisiones de
              reposición en un solo lugar.
            </p>
          </div>

          <div className="relative z-10">
            <LoginNeuralArt />
            <ul className="mt-3 space-y-2.5">
              {valuePoints.map((point) => {
                const Icon = point.icon;
                return (
                  <li className="flex items-start gap-3" key={point.title}>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10">
                      <Icon aria-hidden="true" className="h-4 w-4 text-white/90" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{point.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-white/70">{point.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.section>

        <section className="relative flex min-h-[560px] items-center justify-center px-4 py-10 sm:px-8 lg:min-h-screen">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, var(--glow), transparent 45%), radial-gradient(circle at 10% 85%, var(--glow), transparent 40%)",
            }}
          />

          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="surface-panel relative w-full max-w-md border-border/70 bg-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Acceso demo
            </span>
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Bienvenido de nuevo
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Ingresa para ver el panel de tu minimarket
            </p>

            <form
              className="mt-6 space-y-4"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                void signIn(email, password);
              }}
            >
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                  htmlFor="login-email"
                >
                  Correo
                </label>
                <div className="relative mt-1.5">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    aria-describedby={error ? "login-error" : undefined}
                    aria-invalid={Boolean(error)}
                    autoComplete="username"
                    autoFocus
                    className={cn(
                      "h-11 bg-card/60 pl-10 transition-all duration-200 focus:border-primary/60 focus:ring-2 focus:ring-primary/20",
                      error && "border-destructive/60",
                    )}
                    disabled={disabled}
                    id="login-email"
                    inputMode="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="demo@smartmarket.ai"
                    type="email"
                    value={email}
                  />
                </div>
              </div>

              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                  htmlFor="login-password"
                >
                  Contraseña
                </label>
                <div className="relative mt-1.5">
                  <LockKeyhole
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    aria-describedby={error ? "login-error" : undefined}
                    aria-invalid={Boolean(error)}
                    autoComplete="current-password"
                    className={cn(
                      "h-11 bg-card/60 pl-10 pr-11 transition-all duration-200 focus:border-primary/60 focus:ring-2 focus:ring-primary/20",
                      error && "border-destructive/60",
                    )}
                    disabled={disabled}
                    id="login-password"
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    disabled={disabled}
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="h-4 w-4" />
                    ) : (
                      <Eye aria-hidden="true" className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={remember}
                    disabled={disabled}
                    id="login-remember"
                    onCheckedChange={(checked) => setRemember(checked === true)}
                  />
                  <label
                    className="cursor-pointer text-xs text-muted-foreground"
                    htmlFor="login-remember"
                  >
                    Recordarme
                  </label>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <TrendingUp aria-hidden="true" className="h-3.5 w-3.5 text-ai" />
                  Demo interactiva
                </span>
              </div>

              {error ? (
                <p
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive"
                  id="login-error"
                  role="alert"
                >
                  <TriangleAlert aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {error}
                </p>
              ) : null}

              <Button className="h-11 w-full" disabled={disabled} type="submit" variant="brand">
                {busy ? (
                  <>
                    <LoaderCircle aria-hidden="true" className="animate-spin" />
                    Verificando…
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 border-t border-border/60 pt-4">
              <Button
                className="h-11 w-full border-violet/30 bg-violet/10 text-violet hover:bg-violet/20"
                disabled={disabled}
                onClick={() => void enterDemo()}
                type="button"
                variant="outline"
              >
                {autoFilling ? (
                  <>
                    <LoaderCircle aria-hidden="true" className="animate-spin" />
                    Rellenando…
                  </>
                ) : (
                  <>
                    <WandSparkles aria-hidden="true" />
                    Entrar con cuenta demo
                  </>
                )}
              </Button>
              <p className="mt-2 text-center text-[11px] leading-5 text-muted-foreground">
                Credenciales de demostración:{" "}
                <span className="font-medium tabular-nums text-foreground/80">
                  demo@smartmarket.ai · demo1234
                </span>
              </p>
            </div>

            <div className="mt-6 flex items-start gap-2 border-t border-border/60 pt-4 text-[11px] leading-5 text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>
                Acceso simulado de demostración. No se envían ni guardan datos reales. No es
                autenticación real.
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
