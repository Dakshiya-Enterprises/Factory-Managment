import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { tint } from "@/lib/color";

export type ColorScheme = "light" | "dark";

export interface BrandingConfig {
  companyName: string;
  fullName: string;
  tagline: string;
  logo: string;
  primaryColor: string;
  sidebarColor: string;
  colorScheme: ColorScheme;
  totalDashboards: number;
}

/**
 * Fallback used before /branding/config.json resolves (or if it 404s),
 * so a new deployment never renders with a blank logo/name.
 */
const DEFAULT_BRANDING: BrandingConfig = {
  companyName: "JSW BPSL",
  fullName: "JSW Steel - Bhushan Power & Steel Ltd.",
  tagline: "MADE WITH PRIDE",
  logo: "/branding/jsw-steel-logo.png",
  primaryColor: "#1e56c9",
  sidebarColor: "#0a1a3a",
  colorScheme: "light",
  totalDashboards: 14,
};

const STORAGE_KEY = "jsw-branding-overrides";

function readOverrides(): Partial<BrandingConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeOverrides(overrides: Partial<BrandingConfig>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // localStorage unavailable (private mode, quota) — customization just won't persist.
  }
}

/** Pushes brand colors + light/dark mode onto the CSS custom properties every component already reads from. */
function applyThemeSideEffects(branding: BrandingConfig) {
  const root = document.documentElement;
  root.dataset.theme = branding.colorScheme;

  root.style.setProperty("--color-brand-blue", branding.primaryColor);
  root.style.setProperty("--color-brand-blue-light", tint(branding.primaryColor, 0.25));
  root.style.setProperty("--color-status-info", branding.primaryColor);
  root.style.setProperty(
    "--color-status-info-bg",
    tint(branding.primaryColor, branding.colorScheme === "dark" ? -0.75 : 0.9),
  );
}

interface BrandingContextValue {
  branding: BrandingConfig;
  loaded: boolean;
  updateBranding: (patch: Partial<BrandingConfig>) => void;
  resetBranding: () => void;
}

const BrandingContext = createContext<BrandingContextValue>({
  branding: DEFAULT_BRANDING,
  loaded: false,
  updateBranding: () => {},
  resetBranding: () => {},
});

/**
 * Branding is loaded at runtime from /branding/config.json (the
 * per-deployment defaults) and then layered with any local overrides
 * saved from Settings > Branding, so a new deployment starts from the
 * shipped brand but a user's own customization survives reloads.
 */
export function BrandingProvider({ children }: { children: ReactNode }) {
  const [base, setBase] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [overrides, setOverrides] = useState<Partial<BrandingConfig>>(readOverrides);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/branding/config.json")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: Partial<BrandingConfig>) => {
        if (!cancelled) setBase({ ...DEFAULT_BRANDING, ...data });
      })
      .catch(() => {
        if (!cancelled) setBase(DEFAULT_BRANDING);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const branding: BrandingConfig = { ...base, ...overrides };

  useEffect(() => {
    applyThemeSideEffects(branding);
  }, [branding.primaryColor, branding.colorScheme]);

  /** Passing `undefined` for a field clears that override (falls back to the shipped default) rather than storing "undefined". */
  const updateBranding = (patch: Partial<BrandingConfig>) => {
    setOverrides((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch) as (keyof BrandingConfig)[]) {
        const value = patch[key];
        if (value === undefined) delete next[key];
        else (next as Record<string, unknown>)[key] = value;
      }
      writeOverrides(next);
      return next;
    });
  };

  const resetBranding = () => {
    writeOverrides({});
    setOverrides({});
  };

  return (
    <BrandingContext.Provider value={{ branding, loaded, updateBranding, resetBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
