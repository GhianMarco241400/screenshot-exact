import { createFileRoute, redirect } from "@tanstack/react-router";

import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
  head: () =>
    pageMeta(
      "SmartMarket AI | Panel de demanda e inventario",
      "Accede al panel visual de ventas, demanda estimada y reposición de inventario para un minimarket.",
    ),
  component: () => null,
});
