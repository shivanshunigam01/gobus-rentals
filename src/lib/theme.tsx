import { useEffect, type ReactNode } from "react";

const KEY = "lbr_theme";

/** Forces light mode only — dark mode has been removed from the product. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem(KEY);
  }, []);

  return <>{children}</>;
}
