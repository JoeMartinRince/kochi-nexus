import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, SectionHeader } from "@/components/ui-kit";
import { AgentReasoningStream } from "@/components/agent-reasoning-stream";
import { simulationResult, simulationScenarios } from "@/data/kochi";
import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulate")({
  head: () => ({
    meta: [
      { title: "Event Simulation · Kochi | Project Sentinel" },
      { name: "description", content: "Simulate what-if scenarios across Kochi: accidents, rain, floods, road closures, festivals." },
      { property: "og:title", content: "Event Simulation · Kochi" },
      { property: "og:description", content: "What-if scenario simulator for Kochi." },
    ],
  }),
  component: SimulatePage,
});

function SimulatePage() {
  const [selected, setSelected] = useState("truck");
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);

  const run = () => {
    setRunning(true);
    setRan(false);
    setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, 5200);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Predict · 04.b</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Event Simulation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask <em>what if</em>. Sentinel runs the scenario through all agents and reports impact.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <GlassCard className="lg:col-span-1">
            <SectionHeader title="Scenario" />
            <div className="grid grid-cols-2 gap-2">
              {simulationScenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={cn(
                    "rounded-2xl border p-3 text-left text-xs transition-colors",
                    selected === s.id ? "border-primary bg-accent" : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  <p className="font-medium">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground">{s.where}</p>
                </button>
              ))}
            </div>

            <Button onClick={run} className="mt-4 w-full gap-2" disabled={running}>
              {running ? (
                <>
                  <Sparkles className="size-4 animate-pulse-soft" /> Simulating…
                </>
              ) : (
                <>
                  <Play className="size-4" /> Run simulation
                </>
              )}
            </Button>
          </GlassCard>

          <GlassCard className="lg:col-span-2">
            <SectionHeader title="Multi-agent reasoning" hint={running || ran ? simulationResult.scenario : "Choose a scenario and run"} />
            {(running || ran) && <AgentReasoningStream scenarioId="flood" key={running ? "r" : "d"} />}
            {!running && !ran && (
              <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Idle — Sentinel is standing by.
              </p>
            )}
          </GlassCard>
        </div>

        {ran && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-rise">
            <ImpactCard title="Traffic impact" main={simulationResult.traffic.impact} note={simulationResult.traffic.note} tone="text-warn" />
            <ImpactCard title="Emergency delay" main={simulationResult.emergency.impact} note={simulationResult.emergency.note} tone="text-destructive" />
            <ImpactCard title="Metro impact" main={simulationResult.metro.impact} note={simulationResult.metro.note} tone="text-primary" />
            <ImpactCard title="Police requirement" main={simulationResult.police.impact} note={simulationResult.police.note} tone="text-foreground" />
            <ImpactCard title="Road closures" main={simulationResult.closure.impact} note={simulationResult.closure.note} tone="text-foreground" />
            <ImpactCard title="Est. clearance" main={simulationResult.clearance} note="With Sentinel's plan" tone="text-success" />
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ImpactCard({ title, main, note, tone }: { title: string; main: string; note: string; tone: string }) {
  return (
    <GlassCard>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${tone}`}>{main}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </GlassCard>
  );
}
