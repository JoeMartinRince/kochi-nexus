import { incidents, type Incident } from "@/data/kochi";
import { cn } from "@/lib/utils";

interface Props {
  height?: number | string;
  className?: string;
  showLabels?: boolean;
  pins?: Incident[];
  interactive?: boolean;
}

/**
 * Hand-crafted stylized SVG of Kochi.
 * Not geographically exact — a schematic honoring backwaters + arterial roads.
 */
export function CityMap({
  height = 480,
  className,
  showLabels = true,
  pins = incidents,
  interactive = true,
}: Props) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-porcelain map-grid", className)} style={{ height }}>
      <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* Backwaters */}
        <defs>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.9 0.05 220)" />
            <stop offset="100%" stopColor="oklch(0.85 0.07 220)" />
          </linearGradient>
          <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.97 0.005 90)" />
            <stop offset="100%" stopColor="oklch(0.94 0.008 100)" />
          </linearGradient>
          <linearGradient id="road" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--electric)" stopOpacity="0.35" />
            <stop offset="50%" stopColor="var(--electric)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--electric)" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Water base */}
        <rect x="0" y="0" width="100" height="70" fill="url(#water)" opacity="0.35" />

        {/* Mainland (Ernakulam) */}
        <path
          d="M42,4 C56,3 66,10 68,22 C69,36 66,50 60,60 C55,66 46,68 40,66 C34,64 32,58 32,50 C31,40 33,26 36,16 C37,10 39,5 42,4 Z"
          fill="url(#land)"
          stroke="oklch(0.85 0.01 250)"
          strokeWidth="0.2"
        />

        {/* Willingdon Island */}
        <ellipse cx="24" cy="46" rx="6" ry="10" fill="url(#land)" stroke="oklch(0.85 0.01 250)" strokeWidth="0.2" />

        {/* Fort Kochi peninsula */}
        <path
          d="M12,44 C10,52 12,60 18,62 C22,63 24,58 22,54 C20,50 16,46 12,44 Z"
          fill="url(#land)"
          stroke="oklch(0.85 0.01 250)"
          strokeWidth="0.2"
        />

        {/* Vypin */}
        <path d="M22,10 L28,8 L30,28 L24,30 Z" fill="url(#land)" stroke="oklch(0.85 0.01 250)" strokeWidth="0.2" />

        {/* Kakkanad east */}
        <path
          d="M70,20 C82,22 90,30 88,44 C86,54 78,58 72,52 C68,46 68,32 70,20 Z"
          fill="url(#land)"
          stroke="oklch(0.85 0.01 250)"
          strokeWidth="0.2"
        />

        {/* Metro line (Aluva → Petta) — dashed */}
        <path
          d="M46,4 L44,20 L42,32 L44,44 L46,58 L52,66"
          stroke="var(--electric)"
          strokeWidth="0.4"
          strokeDasharray="1.2 0.8"
          fill="none"
          opacity="0.6"
        />

        {/* Arterial roads */}
        <path d="M32,50 L60,52" stroke="url(#road)" strokeWidth="0.5" fill="none" />
        <path d="M40,20 L68,22" stroke="url(#road)" strokeWidth="0.5" fill="none" />
        <path d="M46,4 L46,66" stroke="url(#road)" strokeWidth="0.4" fill="none" />
        <path d="M22,10 L44,18" stroke="url(#road)" strokeWidth="0.35" fill="none" opacity="0.6" />
        <path d="M24,46 L40,52" stroke="url(#road)" strokeWidth="0.35" fill="none" opacity="0.6" />

        {/* Bridges */}
        <line x1="30" y1="46" x2="34" y2="50" stroke="oklch(0.5 0.02 260)" strokeWidth="0.15" opacity="0.5" />
        <line x1="30" y1="20" x2="36" y2="20" stroke="oklch(0.5 0.02 260)" strokeWidth="0.15" opacity="0.5" />

        {showLabels && (
          <g fontFamily="Inter, sans-serif" fontSize="1.4" fill="oklch(0.4 0.02 260)" fontWeight="500">
            <text x="46" y="6">Aluva</text>
            <text x="34" y="30">Edappally</text>
            <text x="26" y="14">Vypin</text>
            <text x="16" y="60">Fort Kochi</text>
            <text x="42" y="46">MG Road</text>
            <text x="42" y="55">Vytilla</text>
            <text x="42" y="63">Kundannoor</text>
            <text x="72" y="34">Kakkanad</text>
            <text x="30" y="46" opacity="0.5">Willingdon</text>
          </g>
        )}
      </svg>

      {/* Incident pins */}
      {pins.map((p) => (
        <PinMarker key={p.id} p={p} interactive={interactive} />
      ))}
    </div>
  );
}

const severityColor: Record<Incident["severity"], string> = {
  critical: "bg-destructive",
  warning: "bg-warn",
  info: "bg-primary",
  resolved: "bg-success",
};

function PinMarker({ p, interactive }: { p: Incident; interactive: boolean }) {
  const color = severityColor[p.severity];
  return (
    <div
      className={cn("absolute -translate-x-1/2 -translate-y-1/2", interactive && "group cursor-pointer")}
      style={{ left: `${p.x}%`, top: `${p.y}%` }}
    >
      <span className="relative flex size-3">
        <span className={cn("absolute inline-flex h-full w-full animate-pulse-soft rounded-full opacity-70", color)} />
        <span className={cn("relative inline-flex size-3 rounded-full ring-2 ring-background", color)} />
      </span>
      {interactive && (
        <div className="pointer-events-none absolute left-4 top-0 hidden min-w-[160px] rounded-xl border border-border bg-card p-2 text-[11px] shadow-lg group-hover:block">
          <p className="font-semibold text-foreground">{p.title}</p>
          <p className="text-muted-foreground">{p.location}</p>
        </div>
      )}
    </div>
  );
}
