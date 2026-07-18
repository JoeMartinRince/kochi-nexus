import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, LiveBadge, SectionHeader, SeverityChip } from "@/components/ui-kit";
import { cctvFeeds } from "@/data/kochi";
import { cn } from "@/lib/utils";
import { Video } from "lucide-react";

export const Route = createFileRoute("/cctv")({
  head: () => ({
    meta: [
      { title: "AI CCTV Detection · Kochi | Project Sentinel" },
      { name: "description", content: "Live CCTV grid across Kochi with vision AI detection: accidents, congestion, blocked roads." },
      { property: "og:title", content: "AI CCTV Detection · Kochi" },
      { property: "og:description", content: "Live vision AI monitoring across Kochi's key junctions." },
    ],
  }),
  component: CctvPage,
});

function CctvPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Monitor · 02.b</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">AI CCTV Detection</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            6 live feeds. Vision AI classifies incidents in real time with bounding boxes and confidence.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cctvFeeds.map((f) => (
            <GlassCard key={f.id} className="!p-0 overflow-hidden">
              <div className="relative aspect-video overflow-hidden bg-secondary">
                {/* Stylized feed background */}
                <div className="absolute inset-0 map-grid" />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, oklch(0.85 0.05 220 / 0.5), transparent 50%), radial-gradient(circle at 70% 70%, oklch(0.9 0.03 250 / 0.4), transparent 60%)",
                  }}
                />
                {/* Bounding boxes */}
                <div
                  className={cn(
                    "absolute rounded border-2 transition-colors",
                    f.status === "critical" ? "border-destructive" : f.status === "alert" ? "border-warn" : "border-success",
                  )}
                  style={{ left: "22%", top: "40%", width: "28%", height: "36%" }}
                >
                  <span
                    className={cn(
                      "absolute -top-5 left-0 rounded px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider",
                      f.status === "critical"
                        ? "bg-destructive text-destructive-foreground"
                        : f.status === "alert"
                          ? "bg-warn text-white"
                          : "bg-success text-white",
                    )}
                  >
                    {f.detection} · {f.confidence}%
                  </span>
                </div>
                <div className="absolute inset-0 flex items-end justify-between p-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-ink/70 px-1.5 py-0.5 font-mono text-[9px] text-white">
                      {f.id}
                    </span>
                    <LiveBadge label="REC" />
                  </div>
                  <Video className="size-4 text-white/80" />
                </div>
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{f.location}</p>
                  <SeverityChip
                    severity={f.status === "critical" ? "critical" : f.status === "alert" ? "warning" : "info"}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {f.vehicleCount} vehicles · {f.detection} detected
                </p>
                <div className="rounded-xl bg-secondary/60 p-2.5 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">AI:</span>{" "}
                  {f.status === "critical"
                    ? "Immediate response recommended. Dispatching nearest unit."
                    : f.status === "alert"
                      ? "Monitoring closely. Rerouting suggested."
                      : "Baseline flow. No action needed."}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
