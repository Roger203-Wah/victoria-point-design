/*
  DESIGN PHILOSOPHY: Warm Minimal Studio — same as Home.tsx
  - Warm linen bg / deep warm brown headings / sage green accents
  - Fraunces display serif + Plus Jakarta Sans body
  - This page renders the live tracker; source data lives in client/src/data/tracker.ts
  - To update: use the shared GitHub repository with an approved Claude agent
*/

import React, { useState } from "react";
import { LAST_UPDATED, PHASES, SPEND_LOG, type Status } from "@/data/tracker";
import { Link } from "wouter";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return "$" + n.toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function statusLabel(s: Status) {
  switch (s) {
    case "not-started": return "Not Started";
    case "in-progress": return "In Progress";
    case "complete": return "Complete";
    case "on-hold": return "On Hold";
  }
}

function statusStyle(s: Status): React.CSSProperties {
  switch (s) {
    case "not-started": return { background: "oklch(0.92 0.008 75)", color: "oklch(0.48 0.02 60)" };
    case "in-progress": return { background: "oklch(0.93 0.04 200)", color: "oklch(0.32 0.07 200)" };
    case "complete": return { background: "oklch(0.88 0.04 155)", color: "oklch(0.32 0.06 155)" };
    case "on-hold": return { background: "oklch(0.93 0.04 60)", color: "oklch(0.42 0.06 55)" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Tracker() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [spendFilter, setSpendFilter] = useState<string>("all");

  // Budget totals
  const totalBudgetLow = PHASES.reduce((s, p) => s + p.budgetLow, 0);
  const totalBudgetHigh = PHASES.reduce((s, p) => s + p.budgetHigh, 0);
  const totalSpent = SPEND_LOG.reduce((s, e) => s + e.amount, 0);
  const phasesComplete = PHASES.filter((p) => p.status === "complete").length;
  const phasesInProgress = PHASES.filter((p) => p.status === "in-progress").length;

  // Spend by phase
  const spentByPhase = (phaseId: string) =>
    SPEND_LOG.filter((e) => e.phase === phaseId).reduce((s, e) => s + e.amount, 0);

  const filteredSpend = spendFilter === "all"
    ? SPEND_LOG
    : SPEND_LOG.filter((e) => e.phase === spendFilter);

  const pill = (label: string) => (
    <span style={{
      fontSize: "0.62rem",
      fontFamily: "Plus Jakarta Sans, sans-serif",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
      padding: "2px 8px",
      borderRadius: "100px",
    }}>
      {label}
    </span>
  );

  return (
    <div style={{ background: "oklch(0.965 0.008 75)", minHeight: "100vh" }}>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: "oklch(0.965 0.008 75 / 0.95)", backdropFilter: "blur(12px)", borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container flex items-center justify-between h-14">
          <Link href="/">
            <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.95rem", color: "oklch(0.22 0.025 55)", fontWeight: 400, cursor: "pointer" }}>
              ← 14 Prescoter Drive
            </span>
          </Link>
          <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.48 0.06 155)" }}>
            Project Tracker
          </span>
          <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.68rem", color: "oklch(0.58 0.015 60)", fontWeight: 300 }}>
            Updated {LAST_UPDATED}
          </span>
        </div>
      </nav>

      {/* Header */}
      <header className="py-16 border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "oklch(0.52 0.02 60)" }}>
            14 Prescoter Drive — Victoria Point
          </span>
          <h1 className="text-5xl md:text-7xl leading-none mt-3 mb-6" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)", fontWeight: 300 }}>
            Project Tracker
          </h1>
          <p className="text-base max-w-2xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, lineHeight: 1.7 }}>
            Live status, budget tracking, and spend log for the full renovation. Updated through the shared GitHub source — ask an approved Claude agent to log spend, change a phase status, or update a milestone.
          </p>
        </div>
      </header>

      {/* Summary cards */}
      <section className="py-12 border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
            {[
              { label: "Total Budget", value: `${fmt(totalBudgetLow)} – ${fmt(totalBudgetHigh)}`, sub: "Estimated range" },
              { label: "Total Spent", value: fmt(totalSpent), sub: `${Math.round((totalSpent / totalBudgetLow) * 100)}% of low estimate` },
              { label: "Remaining (low)", value: fmt(totalBudgetLow - totalSpent), sub: "Budget low minus spent" },
              { label: "Phases", value: `${phasesComplete} done · ${phasesInProgress} active`, sub: `${PHASES.length} total phases` },
            ].map((card, i) => (
              <div key={i} className="py-8 px-6 border-r last:border-r-0" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
                <div className="text-xs mb-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>{card.label}</div>
                <div className="text-2xl md:text-3xl mb-1" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)", fontWeight: 300 }}>{card.value}</div>
                <div className="text-xs" style={{ color: "oklch(0.58 0.015 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>{card.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase cards */}
      <section className="py-16 border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <div className="mb-10">
            <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "oklch(0.52 0.02 60)" }}>Phases</span>
            <h2 className="text-4xl mt-2" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)", fontWeight: 300 }}>Phase Status</h2>
          </div>

          <div className="flex flex-col gap-0">
            {PHASES.map((phase) => {
              const spent = spentByPhase(phase.id);
              const isExpanded = expandedPhase === phase.id;
              const budgetMid = (phase.budgetLow + phase.budgetHigh) / 2;
              const spentPct = budgetMid > 0 ? Math.min((spent / budgetMid) * 100, 100) : 0;

              return (
                <div
                  key={phase.id}
                  className="border-t"
                  style={{ borderColor: "oklch(0.88 0.012 75)" }}
                >
                  {/* Row */}
                  <button
                    className="w-full text-left"
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  >
                    <div className="grid grid-cols-12 gap-4 py-5 items-center hover:bg-[oklch(0.955_0.008_75)] transition-colors duration-150 px-2 -mx-2 rounded-sm">
                      {/* Number */}
                      <div className="col-span-1 hidden md:block">
                        <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1rem", color: "oklch(0.62 0.015 60)", fontWeight: 300 }}>{phase.num}</span>
                      </div>
                      {/* Title */}
                      <div className="col-span-7 md:col-span-4">
                        <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.9rem", color: "oklch(0.22 0.025 55)" }}>{phase.title}</div>
                        <div className="text-xs mt-0.5" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>{phase.targetStart}{phase.targetEnd !== phase.targetStart && phase.targetEnd !== "Rolling" && phase.targetEnd !== "Flexible" ? ` → ${phase.targetEnd}` : phase.targetEnd === "Rolling" || phase.targetEnd === "Flexible" ? ` (${phase.targetEnd.toLowerCase()})` : ""}</div>
                      </div>
                      {/* Status */}
                      <div className="col-span-3 md:col-span-2">
                        <span style={{ ...statusStyle(phase.status), fontSize: "0.62rem", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "100px" }}>
                          {statusLabel(phase.status)}
                        </span>
                      </div>
                      {/* Budget */}
                      <div className="col-span-2 hidden md:block text-right">
                        <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "oklch(0.28 0.025 55)" }}>
                          {phase.budgetLow === phase.budgetHigh ? fmt(phase.budgetLow) : `${fmt(phase.budgetLow)} – ${fmt(phase.budgetHigh)}`}
                        </div>
                        <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.68rem", fontWeight: 300, color: "oklch(0.52 0.02 60)" }}>budget</div>
                      </div>
                      {/* Spent */}
                      <div className="col-span-2 hidden md:block text-right">
                        <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.78rem", fontWeight: 500, color: spent > 0 ? "oklch(0.32 0.06 155)" : "oklch(0.62 0.015 60)" }}>
                          {fmt(spent)}
                        </div>
                        <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.68rem", fontWeight: 300, color: "oklch(0.52 0.02 60)" }}>spent</div>
                      </div>
                      {/* Expand arrow */}
                      <div className="col-span-2 md:col-span-1 flex justify-end">
                        <span style={{ color: "oklch(0.52 0.02 60)", fontSize: "0.8rem", transition: "transform 0.2s", display: "inline-block", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="pb-8 px-2" style={{ borderTop: "1px solid oklch(0.92 0.008 75)" }}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                        {/* Notes */}
                        <div className="md:col-span-2">
                          <div className="text-xs mb-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Notes</div>
                          <p className="text-sm leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>{phase.notes}</p>
                        </div>
                        {/* Milestones */}
                        <div>
                          <div className="text-xs mb-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Milestones</div>
                          <ul className="flex flex-col gap-2">
                            {phase.milestones.map((m, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                                <span style={{ color: "oklch(0.72 0.015 60)", marginTop: "2px", flexShrink: 0 }}>○</span>
                                {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Budget progress bar */}
                      {budgetMid > 0 && (
                        <div className="mt-6">
                          <div className="flex justify-between text-xs mb-1" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 400 }}>
                            <span>Spent: {fmt(spent)}</span>
                            <span>Budget: {phase.budgetLow === phase.budgetHigh ? fmt(phase.budgetLow) : `${fmt(phase.budgetLow)} – ${fmt(phase.budgetHigh)}`}</span>
                          </div>
                          <div style={{ height: "4px", background: "oklch(0.90 0.008 75)", borderRadius: "2px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${spentPct}%`, background: spentPct > 90 ? "oklch(0.62 0.12 30)" : "oklch(0.48 0.06 155)", borderRadius: "2px", transition: "width 0.4s ease" }} />
                          </div>
                        </div>
                      )}

                      {/* Phase spend entries */}
                      {SPEND_LOG.filter((e) => e.phase === phase.id).length > 0 && (
                        <div className="mt-6">
                          <div className="text-xs mb-3" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Spend Entries</div>
                          <table className="w-full text-xs">
                            <tbody>
                              {SPEND_LOG.filter((e) => e.phase === phase.id).map((e, i) => (
                                <tr key={i} className="border-b" style={{ borderColor: "oklch(0.92 0.008 75)" }}>
                                  <td className="py-2 pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, whiteSpace: "nowrap" }}>{e.date}</td>
                                  <td className="py-2 pr-4" style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 400 }}>{e.description}</td>
                                  <td className="py-2 pr-4 hidden md:table-cell" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>{e.supplier}</td>
                                  <td className="py-2 text-right" style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600, whiteSpace: "nowrap" }}>{fmt(e.amount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }} />
          </div>
        </div>
      </section>

      {/* Full Spend Log */}
      <section className="py-16 border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "oklch(0.52 0.02 60)" }}>Every dollar</span>
              <h2 className="text-4xl mt-2" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)", fontWeight: 300 }}>Spend Log</h2>
            </div>
            {/* Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSpendFilter("all")}
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "4px 12px", borderRadius: "100px", border: "none", cursor: "pointer",
                  background: spendFilter === "all" ? "oklch(0.22 0.025 55)" : "oklch(0.90 0.008 75)",
                  color: spendFilter === "all" ? "oklch(0.97 0.005 75)" : "oklch(0.42 0.02 60)",
                }}
              >All</button>
              {PHASES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSpendFilter(p.id)}
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                    padding: "4px 12px", borderRadius: "100px", border: "none", cursor: "pointer",
                    background: spendFilter === p.id ? "oklch(0.22 0.025 55)" : "oklch(0.90 0.008 75)",
                    color: spendFilter === p.id ? "oklch(0.97 0.005 75)" : "oklch(0.42 0.02 60)",
                  }}
                >{p.title.split(" ")[0]}</button>
              ))}
            </div>
          </div>

          {filteredSpend.length === 0 ? (
            <div className="py-16 text-center" style={{ color: "oklch(0.58 0.015 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, fontSize: "0.9rem" }}>
              No spend recorded for this phase yet.
            </div>
          ) : (
            <div className="border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
                    {[["Date", ""], ["Description", ""], ["Supplier", "hidden md:table-cell"], ["Phase", "hidden md:table-cell"], ["Amount", "text-right"]].map(([h, cls], i) => (
                      <th key={i} className={`py-3 text-left pr-4 ${cls}`} style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...filteredSpend].reverse().map((e, i) => {
                    const phase = PHASES.find((p) => p.id === e.phase);
                    return (
                      <tr key={i} className="border-b" style={{ borderColor: "oklch(0.92 0.008 75)" }}>
                        <td className="py-3 pr-4 whitespace-nowrap" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, fontSize: "0.78rem" }}>{e.date}</td>
                        <td className="py-3 pr-4" style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 400, fontSize: "0.82rem" }}>
                          {e.description}
                          {e.receipt && <span className="ml-2" style={{ color: "oklch(0.58 0.015 60)", fontWeight: 300, fontSize: "0.72rem" }}>({e.receipt})</span>}
                        </td>
                        <td className="py-3 pr-4 hidden md:table-cell" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, fontSize: "0.78rem" }}>{e.supplier}</td>
                        <td className="py-3 pr-4 hidden md:table-cell" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, fontSize: "0.78rem" }}>{phase?.title ?? e.phase}</td>
                        <td className="py-3 text-right whitespace-nowrap" style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600, fontSize: "0.82rem" }}>{fmt(e.amount)}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: "oklch(0.95 0.008 75)" }}>
                    <td className="py-4 pr-4" colSpan={4} style={{ color: "oklch(0.22 0.025 55)", fontFamily: "Fraunces, Georgia, serif", fontSize: "0.95rem", fontWeight: 400 }}>
                      {spendFilter === "all" ? "Total Spent" : `${PHASES.find(p => p.id === spendFilter)?.title ?? ""} — Total`}
                    </td>
                    <td className="py-4 text-right" style={{ color: "oklch(0.22 0.025 55)", fontFamily: "Fraunces, Georgia, serif", fontSize: "0.95rem", fontWeight: 400 }}>
                      {fmt(filteredSpend.reduce((s, e) => s + e.amount, 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* How to update */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl">
            <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "oklch(0.52 0.02 60)" }}>Keeping this current</span>
            <h2 className="text-3xl mt-2 mb-6" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)", fontWeight: 300 }}>How to Update</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              Use an approved Claude agent connected to the shared GitHub repository. Describe what's changed — a phase status, a new spend entry, a milestone completed, or a note to add. The agent should update the tracker source, validate the build, and commit the change for review.
            </p>
            <div className="border-l-2 pl-4 py-1 mb-6" style={{ borderColor: "oklch(0.48 0.06 155)" }}>
              <p className="text-sm italic" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, lineHeight: 1.7 }}>
                "Pool coping started today — mark it In Progress. Also went to Bunnings yesterday and spent $83 on nails and screws for the side access project."
              </p>
            </div>
            <p className="text-xs" style={{ color: "oklch(0.58 0.015 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, lineHeight: 1.7 }}>
              All tracker data lives in the shared website source — no database or public login required. Git history records approved changes, and the tracker URL stays the same after the matching site deployment.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-xl mb-1" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)", fontWeight: 400 }}>14 Prescoter Drive</div>
            <div className="text-xs" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>Victoria Point, QLD — Project Tracker</div>
          </div>
          <Link href="/">
            <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "oklch(0.48 0.06 155)", cursor: "pointer", letterSpacing: "0.04em" }}>
              ← Back to Design Presentation
            </span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
