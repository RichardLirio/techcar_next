"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-yellow-400" />
      <Switch
        checked={isDark}
        onCheckedChange={(checked: boolean) =>
          setTheme(checked ? "dark" : "light")
        }
        className="data-[state=checked]:bg-primary bg-muted transition-colors"
      />
      <Moon className="h-4 w-4 text-slate-900 dark:text-white" />
    </div>
  );
}
