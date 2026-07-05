import { useEffect, useRef, useState } from "react";
import { Bell, Building2, Database, Lock, Moon, Palette, RotateCcw, Sun, Upload } from "lucide-react";
import { SettingsShell } from "@/components/layout/SettingsShell";
import { Card } from "@/components/ui/Card";
import { useBranding, type ColorScheme } from "@/branding/BrandingContext";
import { isValidHex } from "@/lib/color";

const ACCENT_PRESETS = ["#1e56c9", "#16a34a", "#7c3aed", "#dc2626", "#0d9488", "#ea580c"];
const SIDEBAR_PRESETS = ["#0a1a3a", "#111827", "#1c1917", "#0f2027", "#1a1035", "#0b2b26"];
const MAX_LOGO_BYTES = 1.5 * 1024 * 1024;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-muted)]">{label}</span>
      {children}
      {hint && <span className="text-[10.5px] text-[var(--color-muted)]">{hint}</span>}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-page)] px-3 py-2 text-[13px] font-medium text-[var(--color-navy-950)] outline-none transition-colors focus:border-[var(--color-brand-blue)]"
    />
  );
}

function ColorField({
  label,
  value,
  presets,
  onChange,
}: {
  label: string;
  value: string;
  presets: string[];
  onChange: (hex: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const isDraftValid = isValidHex(draft);

  // Keep the free-typed hex field in sync when the value changes from elsewhere
  // (a swatch click, or Reset to Default) rather than from this input itself.
  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <Field label={label}>
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((hex) => (
          <button
            key={hex}
            type="button"
            aria-label={hex}
            onClick={() => {
              onChange(hex);
              setDraft(hex);
            }}
            className="h-7 w-7 shrink-0 rounded-full ring-offset-2 transition-transform hover:scale-110"
            style={{
              background: hex,
              boxShadow: value.toLowerCase() === hex.toLowerCase() ? `0 0 0 2px var(--color-surface), 0 0 0 4px ${hex}` : "none",
            }}
          />
        ))}
        <label className="relative h-7 w-7 shrink-0 cursor-pointer overflow-hidden rounded-full border border-dashed border-[var(--color-border)]">
          <input
            type="color"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setDraft(e.target.value);
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div
            className="pointer-events-none h-full w-full"
            style={{ background: `conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)` }}
          />
        </label>
        <input
          value={draft}
          onChange={(e) => {
            const next = e.target.value;
            setDraft(next);
            if (isValidHex(next)) onChange(next);
          }}
          spellCheck={false}
          className={`w-24 rounded-lg border bg-[var(--color-page)] px-2 py-1.5 font-mono text-[12px] text-[var(--color-navy-950)] outline-none transition-colors ${
            isDraftValid ? "border-[var(--color-border)] focus:border-[var(--color-brand-blue)]" : "border-[var(--color-status-bad)]"
          }`}
        />
      </div>
    </Field>
  );
}

const COMING_SOON_TABS = [
  { key: "general", label: "General", icon: Building2 },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "data", label: "Data & Automation", icon: Database },
];

export function SettingsPage() {
  const { branding, updateBranding, resetBranding } = useBranding();
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (file: File) => {
    setLogoError(null);
    if (!file.type.startsWith("image/")) {
      setLogoError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Logo must be smaller than 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateBranding({ logo: reader.result as string });
    reader.onerror = () => setLogoError("Couldn't read that file — try a different image.");
    reader.readAsDataURL(file);
  };

  return (
    <SettingsShell title="Settings" subtitle="Platform Configuration & Branding">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[220px_1fr]">
        <Card bodyClassName="p-2">
          <ul className="flex flex-col gap-0.5">
            <li>
              <div className="flex items-center gap-2.5 rounded-lg bg-[var(--color-brand-blue)] px-3 py-2 text-[12.5px] font-semibold text-white">
                <Palette className="h-4 w-4 shrink-0" />
                Branding
              </div>
            </li>
            {COMING_SOON_TABS.map((tab) => (
              <li key={tab.key}>
                <div className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] font-medium text-[var(--color-muted)]">
                  <tab.icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{tab.label}</span>
                  <Lock className="h-3 w-3 shrink-0" />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-5">
          <Card
            title="Brand Identity"
            subtitle="Shown across the sidebar and every dashboard header"
            right={
              <button
                type="button"
                onClick={resetBranding}
                className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--color-muted)] transition-colors hover:border-[var(--color-status-bad)] hover:text-[var(--color-status-bad)]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset to Default
              </button>
            }
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Brand Name" hint="Short name shown next to the logo">
                <TextInput
                  value={branding.companyName}
                  maxLength={40}
                  onChange={(e) => updateBranding({ companyName: e.target.value })}
                  placeholder="e.g. JSW"
                />
              </Field>
              <Field label="Tagline" hint="Small caption under the brand name">
                <TextInput
                  value={branding.tagline}
                  maxLength={40}
                  onChange={(e) => updateBranding({ tagline: e.target.value })}
                  placeholder="e.g. MADE WITH PRIDE"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Full / Legal Name" hint="Used in footers and policy text">
                  <TextInput
                    value={branding.fullName}
                    maxLength={80}
                    onChange={(e) => updateBranding({ fullName: e.target.value })}
                    placeholder="e.g. JSW Steel - Bhushan Power & Steel Ltd."
                  />
                </Field>
              </div>
            </div>
          </Card>

          <Card title="Logo">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-page)] p-2">
                <img src={branding.logo} alt="Current logo" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--color-brand-blue)] px-3 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Logo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => updateBranding({ logo: undefined })}
                    className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[12px] font-semibold text-[var(--color-muted)] transition-colors hover:border-[var(--color-status-bad)] hover:text-[var(--color-status-bad)]"
                  >
                    Remove
                  </button>
                </div>
                <span className="text-[10.5px] text-[var(--color-muted)]">PNG, JPG or SVG, up to 1.5 MB.</span>
                {logoError && <span className="text-[11px] font-semibold text-[var(--color-status-bad)]">{logoError}</span>}
              </div>
            </div>
          </Card>

          <Card title="Theme" subtitle="Colors apply live across every dashboard">
            <div className="flex flex-col gap-5">
              <ColorField label="Accent / Primary Color" value={branding.primaryColor} presets={ACCENT_PRESETS} onChange={(hex) => updateBranding({ primaryColor: hex })} />
              <ColorField label="Sidebar Color" value={branding.sidebarColor} presets={SIDEBAR_PRESETS} onChange={(hex) => updateBranding({ sidebarColor: hex })} />

              <Field label="Color Scheme">
                <div className="flex w-fit overflow-hidden rounded-lg border border-[var(--color-border)]">
                  {(
                    [
                      { value: "light" as ColorScheme, label: "Light", icon: Sun },
                      { value: "dark" as ColorScheme, label: "Dark", icon: Moon },
                    ]
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateBranding({ colorScheme: opt.value })}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                        branding.colorScheme === opt.value
                          ? "bg-[var(--color-brand-blue)] text-white"
                          : "bg-[var(--color-page)] text-[var(--color-muted)] hover:text-[var(--color-navy-950)]"
                      }`}
                    >
                      <opt.icon className="h-3.5 w-3.5" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </Card>

          <div className="card px-5 py-3 text-[11.5px] text-[var(--color-muted)]">
            Changes save automatically to this browser. They're mock-data-layer settings today — wiring Settings to a shared tenant config store is a drop-in swap for the same reason the dashboards already read branding from{" "}
            <code className="rounded bg-[var(--color-track)] px-1 py-0.5 font-mono text-[10.5px]">/branding/config.json</code>.
          </div>
        </div>
      </div>
    </SettingsShell>
  );
}
