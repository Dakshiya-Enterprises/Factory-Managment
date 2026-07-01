import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface BrandingConfig {
  companyName: string;
  fullName: string;
  tagline: string;
  logo: string;
  primaryColor: string;
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
  totalDashboards: 14,
};

const BrandingContext = createContext<BrandingConfig>(DEFAULT_BRANDING);

/**
 * Branding is loaded at runtime from /branding/config.json rather than
 * baked into the bundle. Swapping to a different plant/client later is a
 * config + logo file swap, not a code change or rebuild.
 */
export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);

  useEffect(() => {
    let cancelled = false;
    fetch("/branding/config.json")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: BrandingConfig) => {
        if (!cancelled) setBranding({ ...DEFAULT_BRANDING, ...data });
      })
      .catch(() => {
        if (!cancelled) setBranding(DEFAULT_BRANDING);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <BrandingContext.Provider value={branding}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  return useContext(BrandingContext);
}
