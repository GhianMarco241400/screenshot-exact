import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button
      aria-label="Cambiar entre tema claro y oscuro"
      className="rounded-full border border-border/60 bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
      onClick={toggleTheme}
      size="icon"
      title="Cambiar tema"
      type="button"
      variant="ghost"
    >
      <Sun aria-hidden="true" className="hidden h-4 w-4 dark:block" />
      <Moon aria-hidden="true" className="h-4 w-4 dark:hidden" />
    </Button>
  );
}
