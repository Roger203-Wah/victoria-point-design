// Source of truth for the 14 Prescoter Drive project tracker.
// Keep entries factual and use whole AUD dollars unless a receipt requires cents.
// Line items are generated in spendLog.generated.ts from VicPoint_Spend_Master.
// Rerun: python3 scripts/build-spend-log.py path/to/VicPoint_Spend_Master.xlsx
// All new spend belongs in that log, including small DIY and Bunnings purchases.
// Paid spend replaced the retired $15,000 pre-tracker estimate on 13 Nov 2026.
// Phase budgets match the presentation: 15 rows, total $155,000.
// Granny-flat lines do not count: five palm and garden-bed lines ($3,390), the Pointform fence ($3,293.30), and the $18.46 premix.
// Lines dated before 1 Jan 2025 stay in SPEND_LOG on their original phase ids.
// They do not count in project totals. The tracker shows them under Before this project (pre 2025).
// Older spend phase ids still roll up to the matching budget row.

import { SPEND_LOG as generatedSpendLog } from "./spendLog.generated";

export const LAST_UPDATED = "18 Nov 2026";

export type Status = "not-started" | "in-progress" | "complete" | "on-hold";

export interface SpendEntry {
  date: string; // e.g. "13 Nov 2026"
  description: string;
  supplier: string;
  amount: number; // AUD
  phase: string; // must match Phase.id
  area: string; // spend-master area; "Outdoor" sums to the outdoor total
  receipt?: string; // optional invoice or receipt reference
  /** Kept in the log, shown under Excluded, and left out of project totals. */
  excluded?: boolean;
}

const SPEND_MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

/** True when the line is dated before 1 Jan 2025 and must not count in this project. */
export function spendIsBeforeProject(entry: SpendEntry): boolean {
  const [day, month, year] = entry.date.split(" ");
  const parsed = new Date(Number(year), SPEND_MONTHS[month], Number(day));
  return parsed < new Date(2025, 0, 1);
}

export interface Phase {
  id: string;
  num: string;
  title: string;
  status: Status;
  targetStart: string;
  targetEnd: string;
  budgetLow: number;
  budgetHigh: number;
  notes: string;
  milestones: string[];
  /** Legacy spend ids that roll up to this phase. The log lines themselves stay put. */
  spendPhaseIds?: string[];
  /** Kept so old spend lines still have a title. Not shown as a budget phase. */
  hidden?: boolean;
  /** Shown, but left out of the project budget and spent totals. */
  excludeFromTotals?: boolean;
}

export const PHASES: Phase[] = [
  {
    id: "exterior",
    num: "01",
    title: "Street Presence",
    status: "in-progress",
    targetStart: "Underway",
    targetEnd: "Underway",
    budgetLow: 20000,
    budgetHigh: 20000,
    notes: "Retaining wall is done. Still to come: Monument roof paint, trim paint, some electrical, and the front lawn and planting. Budget $20,000.",
    milestones: ["Retaining wall done", "Roof paint, trim paint and some electrical still to do"],
  },
  {
    id: "entrance",
    num: "02",
    title: "Entrance",
    status: "not-started",
    targetStart: "When there is a gap",
    targetEnd: "When there is a gap",
    budgetLow: 1500,
    budgetHigh: 1500,
    notes: "A quick, low-cost refresh that can happen whenever there is a gap. Budget $1,500.",
    milestones: ["Not started"],
  },
  {
    id: "pool",
    num: "03",
    title: "Pool & Outdoor Living",
    status: "in-progress",
    targetStart: "Underway",
    targetEnd: "Into the new year",
    budgetLow: 35000,
    budgetHigh: 35000,
    spendPhaseIds: ["coping", "decking", "crazy-paving", "pool-fence"],
    notes: "Coping and the slab are done. The bench is nearly finished. Still to do: Nimbus crazy pave, the black pool fence, trees and planting. No new quotes. Budget $35,000.",
    milestones: ["Coping and slab done", "Crazy pave from around December", "Black pool fence and planting still to do"],
  },
  {
    id: "back-patio",
    num: "04",
    title: "Back Covered Patio",
    status: "not-started",
    targetStart: "Not started",
    targetEnd: "Not started",
    budgetLow: 1500,
    budgetHigh: 1500,
    notes: "Paint, lighting and a clean up. Any work on the slab is still to decide. Budget $1,500.",
    milestones: ["Not started"],
  },
  {
    id: "back-yard",
    num: "05",
    title: "Back Yard Area",
    status: "not-started",
    targetStart: "Not started",
    targetEnd: "Not started",
    budgetLow: 3000,
    budgetHigh: 3000,
    notes: "Lawn, jasmine on the fence, and the path to the side access. Budget $3,000.",
    milestones: ["Not started"],
  },
  {
    id: "side-access",
    num: "06",
    title: "Side Passage",
    status: "in-progress",
    targetStart: "Underway",
    targetEnd: "After the bathrooms",
    budgetLow: 7500,
    budgetHigh: 7500,
    notes: "Slab is poured and the shed is up and anchored. Budget $7,500, which covers the paid work including the 30% slab share. The last concrete sits in the bathroom budget and gets done after the bathrooms.",
    milestones: ["Slab poured", "Shed up and anchored", "Last concrete after the bathrooms"],
  },
  {
    id: "kitchen",
    num: "07",
    title: "Kitchen",
    status: "in-progress",
    targetStart: "Delivered 17 Nov 2026",
    targetEnd: "Before Christmas",
    budgetLow: 17500,
    budgetHigh: 17500,
    notes: "The IKEA kitchen was delivered on 17 Nov. Jeremy, Zac and John install it before Christmas. Exact dates are not booked. Budget $17,500.",
    milestones: ["Delivered 17 Nov", "Install before Christmas, dates not booked"],
  },
  {
    id: "laundry",
    num: "08",
    title: "Laundry",
    status: "not-started",
    targetStart: "With the kitchen",
    targetEnd: "Before Christmas",
    budgetLow: 3000,
    budgetHigh: 3000,
    notes: "Separate from the bathrooms. Oak floor and white subway tile splashback. Cabinets are already in the paid IKEA order. Budget $3,000.",
    milestones: ["Oak floor and subway tile still to do"],
  },
  {
    id: "bathrooms",
    num: "09",
    title: "Bathrooms",
    status: "not-started",
    targetStart: "Later stage",
    targetEnd: "Later stage",
    budgetLow: 45000,
    budgetHigh: 45000,
    notes: "Both bathrooms are $45,000, with no quotes. John does the carpentry, Jason the plumbing, plus a tiler, a waterproofer and fittings. Jeremy does the demo and painting. This also covers the last side passage concrete.",
    milestones: ["No quotes", "Later stage, with temporary facilities", "Side passage concrete after the bathrooms"],
  },
  {
    id: "living",
    num: "10",
    title: "Living Room",
    status: "not-started",
    targetStart: "After the kitchen",
    targetEnd: "After the kitchen",
    budgetLow: 1000,
    budgetHigh: 1000,
    notes: "A light touch: new warm mid-grey carpet, Natural White, and a few small upgrades. Budget $1,000.",
    milestones: ["Not started"],
  },
  {
    id: "master",
    num: "11",
    title: "Master Bedroom",
    status: "not-started",
    targetStart: "After the kitchen",
    targetEnd: "After the kitchen",
    budgetLow: 3500,
    budgetHigh: 3500,
    notes: "Mainly the walk-in robe fit-out. The robe stays open. Budget $3,500.",
    milestones: ["Not started"],
  },
  {
    id: "bedroom-2",
    num: "12",
    title: "Bedroom 2",
    status: "not-started",
    targetStart: "After the kitchen",
    targetEnd: "After the kitchen",
    budgetLow: 2500,
    budgetHigh: 2500,
    notes: "Paint, trims, carpet and a basic wardrobe update. Budget $2,500.",
    milestones: ["Not started"],
  },
  {
    id: "bedroom-3",
    num: "13",
    title: "Bedroom 3",
    status: "not-started",
    targetStart: "After the kitchen",
    targetEnd: "After the kitchen",
    budgetLow: 5500,
    budgetHigh: 5500,
    notes: "Paint, trims, carpet and a wardrobe update, plus a new wall and door entrance by John Puna. Budget $5,500.",
    milestones: ["New wall and door by John Puna", "Not started"],
  },
  {
    id: "bedroom4",
    num: "14",
    title: "Bedroom 4 / Office",
    status: "not-started",
    targetStart: "After the kitchen",
    targetEnd: "After the kitchen",
    budgetLow: 3500,
    budgetHigh: 3500,
    notes: "Paint, trims, carpet and a custom cupboard. No new walls. Budget $3,500.",
    milestones: ["Not started"],
  },
  {
    id: "general",
    num: "15",
    title: "General",
    status: "not-started",
    targetStart: "Through the house",
    targetEnd: "Through the house",
    budgetLow: 5000,
    budgetHigh: 5000,
    notes: "Jeremy does the plastering, patching and small extras through the house. Budget $5,000.",
    milestones: ["Jeremy plasters and patches"],
  },
  {
    id: "granny-flat",
    num: "",
    title: "Granny flat (not this project)",
    status: "complete",
    targetStart: "Not this project",
    targetEnd: "Not this project",
    budgetLow: 0,
    budgetHigh: 0,
    excludeFromTotals: true,
    notes: "Palm and garden bed removal for the granny flat. Five paid lines, $3,390. This does not count in the renovation budget or the spent total.",
    milestones: ["Excluded from the project totals"],
  },
  {
    id: "interior",
    num: "",
    title: "Earlier interior spend",
    status: "complete",
    targetStart: "Earlier work",
    targetEnd: "Earlier work",
    budgetLow: 0,
    budgetHigh: 0,
    hidden: true,
    notes: "Paid lines from before this budget. Kept so the spend log still has a home. Not part of the $155,000.",
    milestones: [],
  },
  {
    id: "unallocated",
    num: "",
    title: "Unallocated",
    status: "on-hold",
    targetStart: "Uncoded",
    targetEnd: "Uncoded",
    budgetLow: 0,
    budgetHigh: 0,
    hidden: true,
    notes: "Paid lines with no confirmed works phase. Not part of the $155,000.",
    milestones: [],
  },
];

export const SPEND_LOG: SpendEntry[] = generatedSpendLog;
