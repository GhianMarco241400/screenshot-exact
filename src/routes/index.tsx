import { createFileRoute, redirect } from "@tanstack/react-router";

import { hasDemoSession } from "@/lib/demo-auth";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (hasDemoSession()) {
      throw redirect({ to: "/dashboard" });
    }
    throw redirect({ to: "/login" });
  },
  head: () =>
    pageMeta(
      "SmartMarket AI | Panel de demanda e inventario",
      "Accede al panel visual de ventas, demanda estimada y reposición de inventario para un minimarket.",
    ),
  component: () => null,
});
