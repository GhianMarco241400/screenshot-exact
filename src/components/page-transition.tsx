import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useRouterState } from "@tanstack/react-router";

import { RouteSkeleton } from "@/components/route-skeleton";

const SKELETON_MS = 280;

/**
 * Brief skeleton between routes (there is no real data fetching yet) followed by
 * a fade + slide entrance. Respects prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const reduceMotion = useReducedMotion();
  const [readyPath, setReadyPath] = useState<string | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      setReadyPath(pathname);
      return;
    }

    const timer = window.setTimeout(() => setReadyPath(pathname), SKELETON_MS);
    return () => window.clearTimeout(timer);
  }, [pathname, reduceMotion]);

  const ready = readyPath === pathname;

  if (!ready) {
    return <RouteSkeleton />;
  }

  return (
    <motion.div
      key={pathname}
      animate={{ opacity: 1, y: 0 }}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
