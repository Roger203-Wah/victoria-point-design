import React, { useState } from "react";
import { PHASES, SPEND_LOG, spendIsBeforeProject, type Status } from "@/data/tracker";

function fmt(n: number) {
  const rounded = Math.round(n * 100) / 100;
  const sign = rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded);
  const hasCents = Math.abs(abs - Math.round(abs)) > 0.001;
  return (
    sign +
    "$" +
    abs.toLocaleString("en-AU", {
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: 2,
    })
  );
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

// Shared phase list, used by the tracker's Phase Status and the home page Budget Overview.
// Lines marked excluded (maintenance, not reno), granny flat and pre-2025 are never counted.
export function PhaseStatusList({ showTotal = false }: { showTotal?: boolean }) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const listedPhases = PHASES.filter((p) => !p.hidden);
  const budgetPhases = listedPhases.filter((p) => !p.excludeFromTotals);
  const excludedPhaseIds = new Set(PHASES.filter((p) => p.excludeFromTotals).map((p) => p.id));
  const entriesForPhase = (phaseId: string) => {
    const phase = PHASES.find((p) => p.id === phaseId);
    const ids = new Set([phaseId, ...(phase?.spendPhaseIds ?? [])]);
    return SPEND_LOG.filter((e) => ids.has(e.phase) && !spendIsBeforeProject(e) && !e.excluded);
  };
  const spentByPhase = (phaseId: string) =>
    entriesForPhase(phaseId).reduce((s, e) => s + e.amount, 0);
  const totalBudget = budgetPhases.reduce((s, p) => s + (p.budgetLow + p.budgetHigh) / 2, 0);
  const totalSpent = SPEND_LOG.filter(
    (e) => !e.excluded && !spendIsBeforeProject(e) && !excludedPhaseIds.has(e.phase),
  ).reduce((s, e) => s + e.amount, 0);

  return (
    <>
          <div className="flex flex-col gap-0">
            {listedPhases.map((phase) => {
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
                      {entriesForPhase(phase.id).length > 0 && (
                        <div className="mt-6">
                          <div className="text-xs mb-3" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Spend Entries</div>
                          <table className="w-full text-xs">
                            <tbody>
                              {entriesForPhase(phase.id).map((e, i) => (
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
      {showTotal && (
        <div className="grid grid-cols-12 gap-4 py-4 px-2 -mx-2 items-center" style={{ background: "oklch(0.95 0.008 75)" }}>
          <div className="col-span-7 md:col-span-7" style={{ color: "oklch(0.22 0.025 55)", fontFamily: "Fraunces, Georgia, serif", fontSize: "1rem", fontWeight: 400 }}>Total Project</div>
          <div className="col-span-5 md:col-span-2 text-right" style={{ color: "oklch(0.22 0.025 55)", fontFamily: "Fraunces, Georgia, serif", fontSize: "1rem", fontWeight: 400 }}>{fmt(totalBudget)}<div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.68rem", fontWeight: 300, color: "oklch(0.52 0.02 60)" }}>budget</div></div>
          <div className="col-span-12 md:col-span-2 text-right" style={{ color: "oklch(0.32 0.06 155)", fontFamily: "Fraunces, Georgia, serif", fontSize: "1rem", fontWeight: 400 }}>{fmt(totalSpent)}<div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.68rem", fontWeight: 300, color: "oklch(0.52 0.02 60)" }}>spent</div></div>
        </div>
      )}
    </>
  );
}
