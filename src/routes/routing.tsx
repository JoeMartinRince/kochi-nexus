import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, SectionHeader } from "@/components/ui-kit";
import { routingPresets } from "@/data/kochi";
import { Ambulance, Shield, Flame, ArrowRight, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/routing")({
  head: () => ({
    meta: [
      { title: "Emergency Routing · Kochi | Project Sentinel" },
      { name: "description", content: "AI-optimized emergency routing for ambulance, police and fire units across Kochi." },
      { property: "og:title", content: "Emergency Routing · Kochi" },
      { property: "og:description", content: "Fastest routes, green corridors and signal priority for Kochi's emergency fleet." },
    ],
  }),
  component: RoutingPage,
});

const vehicles = [
  { id: "amb", label: "Ambulance", Icon: Ambulance },
  { id: "pol", label: "Police", Icon: Shield },
  { id: "fire", label: "Fire", Icon: Flame },
];

function RoutingPage() {
  const [vehicle, setVehicle] = useState("amb");
  const preset = routingPresets[vehicle === "amb" ? 0 : vehicle === "pol" ? 1 : 2];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Respond · 03.b</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Emergency Routing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fastest routes with green corridor and signal priority. Sentinel optimizes across live traffic.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <GlassCard className="lg:col-span-1">
            <SectionHeader title="Vehicle" />
            <div className="grid grid-cols-3 gap-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVehicle(v.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border p-3 transition-colors",
                    vehicle === v.id ? "border-primary bg-accent text-accent-foreground" : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  <v.Icon className="size-5" />
                  <span className="text-xs font-medium">{v.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              <Field label="From" value={preset.from} />
              <Field label="To" value={preset.to} />
              <div className="rounded-2xl border border-primary/20 bg-accent p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Zap className="size-3.5" />
                  Green corridor active
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Traffic signals held for 45s along the fastest path.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2 !p-0 overflow-hidden">
            <div className="relative aspect-[16/10] bg-porcelain map-grid">
              {/* Simplified route SVG overlay */}
              <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                <defs>
                  <linearGradient id="route" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--electric)" />
                    <stop offset="100%" stopColor="oklch(0.68 0.14 155)" />
                  </linearGradient>
                </defs>
                <path
                  d="M12,10 C25,20 30,30 45,32 S65,28 82,50"
                  stroke="url(#route)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="2 1"
                  style={{ animation: "dash 8s linear infinite" }}
                />
                <circle cx="12" cy="10" r="1.5" fill="var(--electric)" />
                <circle cx="82" cy="50" r="1.5" fill="oklch(0.68 0.14 155)" />
              </svg>
              <div className="absolute left-4 top-4 rounded-full bg-card px-3 py-1 text-[10px] font-medium shadow-sm">
                From · {preset.from}
              </div>
              <div className="absolute bottom-4 right-4 rounded-full bg-card px-3 py-1 text-[10px] font-medium shadow-sm">
                To · {preset.to}
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border">
              <Stat label="ETA" value={preset.eta} />
              <Stat label="Time saved" value={preset.saved} tone="text-success" />
              <Stat label="Priority" value={preset.green ? "Green" : "Standard"} tone="text-primary" />
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border p-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="p-4 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-xl font-semibold ${tone ?? "text-foreground"}`}>{value}</p>
    </div>
  );
}
