// Source of truth for the 14 Prescoter Drive project tracker.
// Keep entries factual and use whole AUD dollars unless a receipt requires cents.
// All new spend belongs in SPEND_LOG — including small DIY and Bunnings purchases.

export const LAST_UPDATED = "26 Feb 2026";

export type Status = "not-started" | "in-progress" | "complete" | "on-hold";

export interface SpendEntry {
  date: string; // e.g. "26 Feb 2026"
  description: string;
  supplier: string;
  amount: number; // AUD
  phase: string; // must match Phase.id
  receipt?: string; // optional invoice or receipt reference
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
}

export const PHASES: Phase[] = [
  {
    id: "coping",
    num: "01",
    title: "Pool Coping",
    status: "not-started",
    targetStart: "Late Mar 2026",
    targetEnd: "Apr 2026",
    budgetLow: 10939,
    budgetHigh: 10939,
    notes:
      "Quote confirmed at $10,939 inc. GST. Contractor advised ~4 weeks from now before they can start. Sets the height for the deck — nothing else in the pool area moves until this is done.",
    milestones: [
      "Confirm start date with contractor",
      "Coping removed and replaced",
      "Final height confirmed for deck quote",
    ],
  },
  {
    id: "decking",
    num: "02",
    title: "Pool Decking + Fence Paint",
    status: "not-started",
    targetStart: "May 2026",
    targetEnd: "May 2026",
    budgetLow: 8000,
    budgetHigh: 12000,
    notes:
      "Dark composite decking (Trex or equivalent). Fence paint Monument — DIY. Get 2–3 quotes once coping is complete and heights are confirmed. Factor in material lead times when ordering.",
    milestones: [
      "Coping complete — heights confirmed",
      "3 decking quotes obtained",
      "Decking ordered",
      "Decking installed",
      "Fence painted Monument (DIY)",
    ],
  },
  {
    id: "side-access",
    num: "—",
    title: "Side Access (Rolling Project)",
    status: "in-progress",
    targetStart: "Mar 2026",
    targetEnd: "Rolling",
    budgetLow: 1500,
    budgetHigh: 2200,
    notes:
      "Already underway. Pour 1.5m × 3m slab at end of passage (trade). Install slimline shed (already purchased). Paint shed and fence Monument (DIY). Garden bed with bromeliads, cordylines, clumping grasses in dark mulch. Solar stake lights along full length. No hard deadline — done progressively.",
    milestones: [
      "Slab poured",
      "Shed installed",
      "Shed + fence painted Monument",
      "Garden bed planted",
      "Solar lights installed",
    ],
  },
  {
    id: "crazy-paving",
    num: "03",
    title: "Crazy Paving",
    status: "not-started",
    targetStart: "Post-decking",
    targetEnd: "Flexible",
    budgetLow: 4800,
    budgetHigh: 5500,
    notes:
      "40m² around existing concreted pool surrounds. $105/m² for paving. Additional materials: adhesive, grout, edging, sand bed (~$800–$1,200). DIY laid — done at own pace after decking is complete.",
    milestones: ["Materials ordered", "Paving laid and grouted"],
  },
  {
    id: "pool-fence",
    num: "04",
    title: "Pool Fence + Landscaping",
    status: "not-started",
    targetStart: "Post-decking",
    targetEnd: "Flexible",
    budgetLow: 2500,
    budgetHigh: 4000,
    notes:
      "ProtectorAl black aluminium pool fence from Bunnings — DIY install, QLD compliant. Festoon lights and deck step lights DIY. Black shade sail over pool area. Remove unwanted concrete sections (DIY cut and remove), level lawn, seed existing grass, clean up trees and garden surrounds.",
    milestones: [
      "Pool fence panels purchased",
      "Pool fence installed and certified",
      "Shade sail installed",
      "Concrete removed, lawn levelled and seeded",
      "Festoon lights installed",
    ],
  },
  {
    id: "kitchen",
    num: "05",
    title: "Kitchen",
    status: "not-started",
    targetStart: "Order Mar/Apr 2026",
    targetEnd: "Install May/Jun 2026",
    budgetLow: 17500,
    budgetHigh: 20000,
    notes:
      "IKEA order placed during March/April sale. Full demo including wall removal — DIY. Get 2–3 quotes from IKEA-experienced installers. Minor electrical and plumbing adjustments only. LVP flooring in kitchen laid after cabinets are installed. IKEA plan total: $13,315.97.",
    milestones: [
      "IKEA sale confirmed — order placed",
      "3 installer quotes obtained",
      "Installer booked",
      "Demo complete (DIY)",
      "IKEA delivery received",
      "Kitchen installed",
      "Electrical and plumbing signed off",
    ],
  },
  {
    id: "bedroom4",
    num: "06",
    title: "Bedroom 4 + Whole-House Plastering",
    status: "not-started",
    targetStart: "Jun 2026",
    targetEnd: "Jul 2026",
    budgetLow: 3000,
    budgetHigh: 5000,
    notes:
      "New wall, doorway, and door creates Bedroom 4. Existing Bedroom 3 door opening filled, new door added. DIY framing with chippy mates. Plasterer in for sheeting, setting, and ceiling touch-ups throughout whole house. All ceiling imperfections addressed here — before any painting begins.",
    milestones: [
      "Framing complete (DIY + chippy)",
      "Plasterer booked",
      "Plastering complete — whole house",
      "Plaster cured and sanded",
    ],
  },
  {
    id: "interior",
    num: "07",
    title: "Lounge + Bedrooms Interior",
    status: "not-started",
    targetStart: "Jul 2026",
    targetEnd: "Aug 2026",
    budgetLow: 11100,
    budgetHigh: 16100,
    notes:
      "Room by room. Order carpet in full (single dye lot, held by supplier). Sequence: Lounge → Master (move to Bed 3) → Beds 3 & 4 simultaneously → Bed 2/office last (move to Bed 4). Each room: paint → architraves → fans → cupboard doors → carpet. LVP (kitchen/hallway/entry) laid last — DIY + mate, supply only.",
    milestones: [
      "Carpet measured and ordered (full quantity)",
      "Lounge complete + carpet installed (Visit 1)",
      "Master complete + carpet installed",
      "Bedrooms 3 & 4 complete + carpet installed",
      "Bedroom 2 complete + carpet installed (Visit 2)",
      "LVP flooring laid (kitchen, hallway, entry)",
    ],
  },
  {
    id: "bathrooms",
    num: "08",
    title: "Bathrooms + Laundry",
    status: "not-started",
    targetStart: "Demo before 2 Sep 2026",
    targetEnd: "Oct 2026",
    budgetLow: 53000,
    budgetHigh: 57000,
    notes:
      "Most complex phase. Full demo before departure 2 Sep. ShawCon Projects (QU-0073: $45,300) builds both bathrooms + laundry. Richmond Contracting (#1288: $7,485) handles all plumbing. Portable shower hire and short-stay accommodation on return while finishing touches completed. Bathroom painting on return — DIY.",
    milestones: [
      "ShawCon booked — September confirmed",
      "Richmond Contracting booked",
      "Demo complete before 2 Sep",
      "Departed for Bali (2 Sep)",
      "Bathrooms majority complete on return (24 Sep)",
      "Plumbing fit-off complete",
      "Bathroom painting complete (DIY)",
      "Final inspection and sign-off",
    ],
  },
  {
    id: "exterior",
    num: "09",
    title: "Exterior",
    status: "in-progress",
    targetStart: "Rolling 2026",
    targetEnd: "Rolling",
    budgetLow: 6000,
    budgetHigh: 10000,
    notes:
      "Roof repaint (Colorbond Ironstone) — professional clean, prep, and paint. Partial gutter replacement where needed — trade. All other exterior painting (fascia, window frames, front door matte black) — DIY. Front garden planting (Lilly Pilly columnar trees, entry pots with Agave) — DIY. Driveway stays as-is.",
    milestones: [
      "Roof repaint quoted",
      "Gutter replacement completed",
      "Roof repainted",
      "Fascia and window frames painted (DIY)",
      "Front door painted matte black (DIY)",
      "Front garden planted",
    ],
  },
];

export const SPEND_LOG: SpendEntry[] = [
  {
    date: "Feb 2026",
    description: "Previous exterior improvements (pre-tracker)",
    supplier: "Various",
    amount: 15000,
    phase: "exterior",
    receipt: "Pre-renovation spend — estimated",
  },
];
