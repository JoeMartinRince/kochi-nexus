# Project Sentinel — Refined Plan

Same visual direction (Porcelain + Electric Blue, Space Grotesk + Inter, rounded 24px, soft shadows, glass, custom SVG Kochi map). No screens removed. Change is information architecture, hierarchy, and reusable UX primitives.

## 1. Workflow-based navigation

Sidebar and mobile bottom nav reorganized around a 6-stage workflow with subtle "→" separators/tick markers so the user reads it as a pipeline, not disconnected pages:

```
Dashboard → Monitor → Respond → Predict → Analyze → Replay
```

Route grouping (files stay; only nav grouping/labels change):

- **Dashboard** — `/` (Home / AI OS overview)
- **Monitor** — `/map` (Digital Twin), `/cctv`, `/transit`
- **Respond** — `/alerts`, `/routing`, `/reports`
- **Predict** — `/flood`, `/simulate`
- **Analyze** — `/copilot`, `/reports/executive` (new)
- **Advanced Analysis** — `/replay` (labeled "Advanced Analysis", collapsed under a secondary section, not a primary tab)

Mobile bottom nav shows the five primary stages + center FAB ("Ask Sentinel"). Desktop sidebar groups screens under each stage with a soft label. Active stage highlighted with the electric accent.

## 2. Home Screen — AI OS layout

Top-to-bottom composition on `/`:

1. **Greeting header** — "Good morning," + "Kochi Command Center" + live pill "AI Monitoring Active" (animated pulse dot).
2. **System Status Bar** (new component `SystemStatusBar`) — horizontal chips: Traffic Network • Weather • Vision AI • GPS • AI Monitoring — each with live/degraded dot. Sticky under the header on desktop.
3. **City Health Score** — large circular card (existing `HealthRing`, promoted to hero size, count-up animation).
4. **Today's AI Brief** — bulleted card: 2 Critical Incidents · 5 Predicted Congestions · 1 Flood Warning · Peak Traffic Expected at 6:15 PM. Each bullet links to the relevant screen.
5. **Quick Actions** (new `QuickActionsGrid`) — 5 pill/tile buttons: Open CCTV · Report Incident · Run Simulation · Emergency Dispatch · AI Copilot. Each navigates to the matching route.
6. **Digital Twin Map Preview** — mini `CityMap` with pulsing pins, "Open Full Map →".
7. **Recent AI Decisions** — vertical list of the last 4 decisions (agent, action, time, outcome chip).
8. **Live Incidents** — existing `IncidentRow` list.

Mobile stacks single-column with generous spacing; desktop lays 3/4/5/7 as a two-column grid (Brief + Quick Actions on the right of the Health Score) with the Map Preview full-width below.

## 3. Global "Ask Sentinel" assistant

New component `SentinelAssistant`:

- Floating pill button, bottom-right on desktop, integrated into the mobile bottom nav's center FAB. Always visible except on `/copilot`.
- Opens a right-side sheet on desktop, full-height sheet on mobile.
- Inside: compact AI Copilot surface using AI Elements primitives (Conversation, Message, MessageResponse, PromptInput). Mocked deterministic responses.
- Header link "Open full Copilot →" navigates to `/copilot` and carries the current draft.
- Suggested prompt chips (see #8) appear when the thread is empty.
- `/copilot` page kept intact as the full experience.

## 4. Reusable AI Reasoning component

Promote current agent stream into `AgentReasoningStream` (single canonical implementation, used on Home, Alert detail, Simulate, Copilot):

- Rows: Traffic Agent · Weather Agent · Emergency Agent · Police Agent · Master AI.
- Each row animates in sequentially with a typing shimmer, then settles into its final line.
- Master AI row rendered emphasized (electric accent, "Final decision generated." headline + one-line summary).
- Props: `scenarioId` selects the canned transcript; `compact` variant for cards.

## 5. AI Decision Timeline

Promote to shared `DecisionTimeline` used on every alert/incident detail and in the Replay comparison:

```
Incident Reported → Vision Analysis → Traffic Prediction → Weather Analysis
  → Police Assignment → Emergency Dispatch → Citizen Notification → Resolved
```

- Vertical on mobile, horizontal on desktop.
- Each node: label, timestamp, actor, status (done / active / pending). Animated fill along the connector.

## 6. System Status Bar

`SystemStatusBar` component described in #2. Rendered on Home and inside the desktop top bar of `AppShell` so it's globally visible.

## 7. Notification Center

- Bell icon in the top bar (desktop) and header (mobile), with unread count badge.
- Opens a right-side sheet: tabs / sections Critical Alerts · Warnings · Resolved · System Updates.
- Backed by mock notifications in `src/data/kochi.ts`; mark-as-read is local state only.

## 8. Suggested AI Prompts

Chips rendered inside both `SentinelAssistant` (when empty) and `/copilot`:

- Explain congestion at Vytilla
- Predict flood at Kundannoor
- Show all accidents
- Nearest ambulance
- Generate morning report
- Run city simulation

Clicking a chip fills the composer and auto-sends the mocked response.

## 9. Executive Report

- Button "Generate Executive Summary" on the Dashboard (top-right of hero) and inside `/copilot`.
- Opens a printable card at `/reports/executive` (new route) styled like a formal export:
  - Header with date, city, "Prepared by Sentinel AI"
  - Sections: Traffic Overview · Emergency Summary · Flood Risk · AI Recommendations
  - "Export PDF" and "Copy Markdown" actions (client-side; `window.print()` + clipboard)
- Uses the same tokens; typography leans more editorial (serif-free but formal), designed to look presentable to a government officer.

## 10. City Replay → "Advanced Analysis"

- Sidebar label becomes "Advanced Analysis" under a separate divider below the main 5-stage workflow.
- Route kept at `/replay`; page header renamed accordingly.
- Removed from mobile bottom nav; reachable via the "More" overflow.

## Cross-cutting deliverables

- Refactor `AppShell` (sidebar + top bar + mobile bottom nav) around the 6-stage IA.
- New components: `SystemStatusBar`, `QuickActionsGrid`, `SentinelAssistant`, `NotificationCenter`, `SuggestedPrompts`, `ExecutiveReport`.
- Promote `AgentReasoningStream` and `DecisionTimeline` to shared primitives; replace inline copies.
- Home screen rebuilt in the new order; other screens unchanged in content, only touched to consume the promoted shared components.
- All mock data centralized in `src/data/kochi.ts` (adds: system-status feed, notifications, quick-actions map, executive-report snapshot).

## Out of scope

- Real backend, real notifications, real PDF export (client-side print only), auth, dark mode.
- Removing or restructuring any existing feature module.
