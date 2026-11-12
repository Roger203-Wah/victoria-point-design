/*
  DESIGN PHILOSOPHY: Warm Minimal Studio
  - Warm linen bg / deep warm brown headings / sage green accents
  - Fraunces display serif + Plus Jakarta Sans body
  - Scroll-triggered fade-in animations
  - Before/After toggle on key spaces
*/

import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

// Public files keep their names. BASE_URL is "/" locally and the repo path on GitHub Pages.
const publicAsset = (file: string) =>
  `${import.meta.env.BASE_URL}${file.replace(/^\//, "")}`;

// Presentation images served from client/public/images
const ASSETS = {
  // Renders (after)
  front_facade: publicAsset("images/front_facade.webp"),
  side_access: publicAsset("images/side_access.webp"),
  lounge: publicAsset("images/lounge.webp"),
  master_bedroom: publicAsset("images/master_bedroom.webp"),
  bedroom2: publicAsset("images/bedroom2.webp"),
  kitchen_pendants: publicAsset("images/kitchen_pendants.webp"),
  kitchen_clean: publicAsset("images/kitchen_clean.webp"),
  hallway: publicAsset("images/hallway.webp"),
  // Pool — after renders (new)
  pool_after_deck: publicAsset("images/pool_after_deck.webp"),
  pool_after_patio: publicAsset("images/pool_after_patio.webp"),
  // Pool — before photos (new)
  pool_before_1: publicAsset("images/pool_before_1.webp"),
  pool_before_2: publicAsset("images/pool_before_2.webp"),
  // Bathrooms (new renders)
  main_bathroom: publicAsset("images/main_bathroom.webp"),
  ensuite: publicAsset("images/ensuite.webp"),
  // Laundry
  laundry_white: publicAsset("images/laundry_white.webp"),
  laundry_oak: publicAsset("images/laundry_oak.webp"),
  // Before photos
  before_facade: publicAsset("images/before_facade.webp"),
  before_master: publicAsset("images/before_master.webp"),
  before_kitchen: publicAsset("images/before_kitchen.webp"),
  before_hallway: publicAsset("images/before_hallway.webp"),
  before_bedroom2: publicAsset("images/before_bedroom2.webp"),
};

const PALETTE = [
  { name: "Natural White", code: "Dulux Natural White", hex: "#F5F2EE", use: "All interior walls throughout" },
  { name: "Warm Mid-Grey", code: "Carpet — Feltex / Godfrey Hirst", hex: "#9A9490", use: "All carpeted areas: lounge, master, bedrooms 2 & 3" },
  { name: "Natural Oak", code: "Karndean / Hybrid LVP", hex: "#C8A97A", use: "Kitchen, hallway, dining — European oak LVP" },
  { name: "Charcoal", code: "Colorbond Ironstone", hex: "#3D3D3B", use: "Exterior fence, retaining wall, roof, garage door, trim" },
  { name: "Sage Green", code: "IKEA NICKEBO", hex: "#7A8C7E", use: "Kitchen lower cabinets and plinth" },
  { name: "Light Concrete", code: "IKEA EKBACKEN", hex: "#D8D4CE", use: "Kitchen benchtop — light grey concrete effect laminate" },
  { name: "Matte Black", code: "Hardware finish", hex: "#1C1C1A", use: "All handles, tapware, fans, light fittings, door furniture" },
  { name: "Oatmeal Linen", code: "Upholstery fabric", hex: "#D4C9B5", use: "Master & secondary bedroom bedheads, soft furnishings" },
];

// FadeUp animation component
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`fade-up ${className}`}>
      {children}
    </div>
  );
}

// Before/After toggle component
function BeforeAfter({ before, after, beforeLabel = "Before", afterLabel = "After", badge }: {
  before: string; after: string; beforeLabel?: string; afterLabel?: string; badge?: string;
}) {
  const [showBefore, setShowBefore] = useState(false);
  return (
    <div className="relative overflow-hidden" style={{ borderRadius: "2px" }}>
      <img
        src={showBefore ? before : after}
        alt={showBefore ? beforeLabel : afterLabel}
        className="w-full h-72 md:h-[480px] object-cover transition-opacity duration-300"
      />
      {badge && !showBefore && (
        <div
          className="absolute top-3 left-3"
          style={{
            background: "oklch(0.15 0.01 55 / 0.82)",
            color: "oklch(0.97 0.005 75)",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            padding: "6px 10px",
            borderRadius: "2px",
            maxWidth: "calc(100% - 1.5rem)",
          }}
        >
          {badge}
        </div>
      )}
      {/* Toggle pill */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex"
        style={{
          background: "oklch(0.15 0.01 55 / 0.75)",
          backdropFilter: "blur(8px)",
          borderRadius: "100px",
          padding: "3px",
          gap: "2px",
        }}
      >
        <button
          onClick={() => setShowBefore(false)}
          style={{
            padding: "6px 16px",
            borderRadius: "100px",
            fontSize: "0.7rem",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            background: !showBefore ? "oklch(0.97 0.005 75)" : "transparent",
            color: !showBefore ? "oklch(0.22 0.025 55)" : "oklch(0.75 0.005 75)",
          }}
        >
          {afterLabel}
        </button>
        <button
          onClick={() => setShowBefore(true)}
          style={{
            padding: "6px 16px",
            borderRadius: "100px",
            fontSize: "0.7rem",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            background: showBefore ? "oklch(0.97 0.005 75)" : "transparent",
            color: showBefore ? "oklch(0.22 0.025 55)" : "oklch(0.75 0.005 75)",
          }}
        >
          {beforeLabel}
        </button>
      </div>
    </div>
  );
}

// Spec table
function SpecTable({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
      <table className="w-full text-sm">
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b" style={{ borderColor: "oklch(0.92 0.008 75)" }}>
              <td
                className="py-3 pr-8 w-48 shrink-0"
                style={{
                  color: "oklch(0.52 0.02 60)",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.72rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </td>
              <td className="py-3" style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Section header
function SectionHeader({ label, title, status }: { label: string; title: string; status: "locked" | "pending" | "options" }) {
  return (
    <FadeUp>
      <div className="flex items-start justify-between mb-10">
        <div>
          <span className="section-label mb-3 block">{label}</span>
          <h2 className="text-5xl md:text-6xl leading-none" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)" }}>
            {title}
          </h2>
        </div>
        <span className={status === "locked" ? "status-locked" : status === "options" ? "status-pending" : "status-pending"} style={status === "options" ? { background: "oklch(0.93 0.025 75)", color: "oklch(0.38 0.03 60)" } : {}}>
          {status === "locked" ? "Locked In" : status === "options" ? "2 Options" : "Pending"}
        </span>
      </div>
    </FadeUp>
  );
}

export default function Home() {
  const sections = [
    { id: "exterior", label: "Street Presence" },
    { id: "pool", label: "Pool & Outdoor" },
    { id: "side-access", label: "Side Passage" },
    { id: "kitchen", label: "Kitchen" },
    { id: "bathrooms", label: "Bathrooms" },
    { id: "laundry", label: "Laundry" },
    { id: "lounge", label: "Living Room" },
    { id: "hallway", label: "Hallway & Floors" },
    { id: "master", label: "Master Bedroom" },
    { id: "bedrooms", label: "Bedrooms 2 & 3" },
    { id: "project-plan", label: "Project Plan" },
    { id: "budget", label: "Budget" },
    { id: "investment", label: "Investment Case" },
  ];

  const [activeSection, setActiveSection] = useState("exterior");

  useEffect(() => {
    const handleScroll = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: "oklch(0.965 0.008 75)", minHeight: "100vh" }}>

      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: "oklch(0.965 0.008 75 / 0.95)", backdropFilter: "blur(12px)", borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container flex items-center justify-between h-14">
          <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.95rem", color: "oklch(0.22 0.025 55)", fontWeight: 400 }}>
            14 Prescoter Drive
          </span>
          <div className="flex items-center gap-3 lg:gap-5 flex-wrap">
            <Link
              href="/tracker"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 600,
                fontSize: "0.68rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "oklch(0.97 0.005 75)",
                background: "oklch(0.38 0.06 155)",
                padding: "5px 14px",
                borderRadius: "100px",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
            >
              Project Tracker
            </Link>
            <div className="hidden lg:flex items-center gap-5 flex-wrap">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: activeSection === s.id ? 600 : 400,
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  color: activeSection === s.id ? "oklch(0.48 0.06 155)" : "oklch(0.52 0.02 60)",
                  paddingBottom: "2px",
                  background: "none",
                  border: "none",
                  borderBottom: activeSection === s.id ? "1.5px solid oklch(0.48 0.06 155)" : "1.5px solid transparent",
                  cursor: "pointer",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                {s.label}
              </button>
            ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden" style={{ minHeight: "90vh" }}>
        <img src={ASSETS.front_facade} alt="14 Prescoter Drive" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.5)" }} />
        <div className="relative z-10 container flex flex-col justify-end" style={{ minHeight: "90vh", paddingBottom: "5rem" }}>
          <FadeUp>
            <div className="flex items-center gap-3 mb-6">
              <span style={{ background: "oklch(0.85 0.02 75)", width: "2rem", height: "1.5px", display: "inline-block" }}></span>
              <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "oklch(0.85 0.02 75)" }}>
                Renovation Design Presentation
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl leading-none mb-6" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.97 0.005 75)", fontWeight: 300, maxWidth: "14ch" }}>
              14 Prescoter Drive
            </h1>
            <p className="text-lg max-w-xl" style={{ fontFamily: "Plus Jakarta Sans, sans-serif", color: "oklch(0.82 0.01 75)", fontWeight: 300, lineHeight: 1.7 }}>
              Victoria Point, QLD — Full residential renovation. A cohesive design language across all interior and exterior spaces, resolved for long-term rental performance.
            </p>
          </FadeUp>
        </div>
      </header>

      {/* Design overview */}
      <section className="py-20 border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <FadeUp className="lg:col-span-1">
              <span className="section-label mb-4 block">Design Overview</span>
              <h2 className="text-4xl leading-tight mb-6" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)" }}>
                One cohesive palette. Every space resolved.
              </h2>
            </FadeUp>
            <FadeUp delay={150} className="lg:col-span-2">
              <p className="text-base leading-relaxed mb-6" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The renovation is designed as a single, unified project rather than a collection of individual room upgrades. Every space shares the same material vocabulary: natural oak timber, warm mid-grey carpet, matte black hardware, and Dulux Natural White walls. This consistency means the house photographs as a premium, considered property — not a patchwork of renovations completed at different times.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The design prioritises durability and rental performance without sacrificing quality. Every finish selection has been made with a long-term tenant in mind: LVP flooring over tiles, matte black hardware over chrome, DC ceiling fans for energy efficiency, and low-maintenance tropical planting throughout the exterior.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={200}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-16 border-t border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
              {[
                { num: "10", label: "Spaces Designed" },
                { num: "100%", label: "Spaces Locked In" },
                { num: "1", label: "Unified Palette" },
                { num: "QLD", label: "Victoria Point" },
              ].map((stat, i) => (
                <div key={i} className="py-8 px-6 border-r last:border-r-0" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
                  <div className="text-4xl mb-1" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)", fontWeight: 300 }}>{stat.num}</div>
                  <div className="text-xs" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Colour Palette */}
      <section className="py-20 border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <FadeUp>
            <span className="section-label mb-4 block">Colour & Materials</span>
            <h2 className="text-5xl leading-none mb-12" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)" }}>The Palette</h2>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PALETTE.map((swatch, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className="group">
                  <div className="w-full h-20 mb-3 transition-transform duration-300 group-hover:scale-[1.02]" style={{ background: swatch.hex, borderRadius: "2px", border: "1px solid oklch(0.85 0.01 75)" }} />
                  <div className="text-sm font-medium mb-1" style={{ color: "oklch(0.22 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{swatch.name}</div>
                  <div className="text-xs mb-1" style={{ color: "oklch(0.48 0.06 155)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}>{swatch.code}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>{swatch.use}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 01 — Exterior / Street Presence */}
      <section id="exterior" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="01 — Exterior" title="Street Presence" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12 items-start">
            <FadeUp delay={100} className="lg:col-span-3">
              <BeforeAfter before={ASSETS.before_facade} after={ASSETS.front_facade} />
            </FadeUp>
            <FadeUp delay={200} className="lg:col-span-2">
              <p className="text-base leading-relaxed mb-6" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The existing red brick is retained as the hero material — warm, textural, and distinctive. Everything around it is resolved in a unified charcoal palette: a Monument roof, charcoal panel-lift garage door, charcoal rendered retaining wall, and charcoal fascia and window frames. The result is a deliberate, contemporary facade that photographs exceptionally well for rental listings.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Roof", value: "Professional repaint, colour leaning Monument — not started" },
              { label: "Garage Door", value: "Charcoal panel-lift, horizontal ribbing" },
              { label: "Retaining Wall", value: "Smooth charcoal render over existing timber sleepers" },
              { label: "Fascia & Eaves", value: "Charcoal — all trim unified" },
              { label: "Window Frames", value: "Charcoal — consistent with trim" },
              { label: "Front Door", value: "Matte black" },
              { label: "Entry Lighting", value: "Matte black wall sconces flanking door" },
              { label: "Driveway", value: "Stays as-is" },
              { label: "Lawn", value: "Sir Walter buffalo — fresh turf, well-edged" },
              { label: "Trees", value: "2–3 columnar Lilly Pilly 'Slim' from lawn behind retaining wall" },
              { label: "Entry Pots", value: "2× large black ceramic pots with Agave, flanking front door" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 02 — Pool & Outdoor Living */}
      <section id="pool" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="02 — Pool & Outdoor Living" title="Pool & Outdoor Living" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <FadeUp delay={100}>
              <BeforeAfter before={ASSETS.pool_before_1} after={ASSETS.pool_after_deck} afterLabel="Concept" badge="original concept (superseded)" />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>original concept (superseded) — composite deck around the pool. Not the current plan.</p>
            </FadeUp>
            <FadeUp delay={200}>
              <BeforeAfter before={ASSETS.pool_before_2} after={ASSETS.pool_after_patio} afterLabel="Concept" badge="original concept (superseded)" />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>original concept (superseded) — deck and shade-sail render. Not the current plan.</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <p className="text-base leading-relaxed mb-10 max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              The pictures above are the original concept (superseded). They show a composite deck, not the work that is underway. The current outdoor plan is coping (done and paid), Nimbus granite crazy paving on the slab (not laid yet), the timber pool bench, the Absco shed, and the pool shed screen. Photos of that work are not on this site yet. Charcoal Colorbond fencing and the warm planting palette still carry through to the side access.
            </p>
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Coping", value: "Done and paid — Project Dream Pools" },
              { label: "Paving", value: "Nimbus granite crazy pave, flamed — about 40 m², not laid yet" },
              { label: "Pool bench", value: "Mostly built — bottom palings wait until after tiling" },
              { label: "Shed", value: "Absco Space Saver WG30152SK, Woodland Grey — erected and anchored" },
              { label: "Shed screen", value: "In progress — first section partly fitted" },
              { label: "Fence", value: "Charcoal Colorbond fence and gate — in" },
              { label: "Shade sail", value: "Going back up over the pool area" },
              { label: "Pergola", value: "original concept (superseded) — not in the current plan" },
              { label: "Deck lighting", value: "original concept (superseded) — there is no composite deck" },
              { label: "Planting", value: "Bromeliads, cordylines, clumping grasses — dark mulch" },
              { label: "Lawn", value: "Sir Walter buffalo — rear yard" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 03 — Side Access */}
      <section id="side-access" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="03 — Side Access" title="Side Passage" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12 items-start lg:[direction:rtl]">
            <FadeUp delay={100} className="lg:col-span-3">
              <div className="[direction:ltr]">
                <div className="overflow-hidden relative" style={{ borderRadius: "2px" }}>
                  <img src={ASSETS.side_access} alt="original concept (superseded) — side passage planting" className="w-full h-72 md:h-[480px] object-cover transition-transform duration-700 hover:scale-[1.02]" />
                  <div
                    className="absolute top-3 left-3"
                    style={{
                      background: "oklch(0.15 0.01 55 / 0.82)",
                      color: "oklch(0.97 0.005 75)",
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      padding: "6px 10px",
                      borderRadius: "2px",
                    }}
                  >
                    original concept (superseded)
                  </div>
                </div>
                <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>original concept (superseded) — passage planting only. It does not show the Absco shed or the shed screen.</p>
              </div>
            </FadeUp>
            <FadeUp delay={200} className="lg:col-span-2">
              <div className="[direction:ltr]">
                <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                  The side passage connects the street to the pool area. The picture is the original concept (superseded): it shows the planting idea only, not the Absco shed or the pool shed screen. The slab for this passage was poured on 3–4 Oct (16.1 m²). The charcoal Colorbond fence, dark mulch, and solar stake lights are still the passage palette.
                </p>
              </div>
            </FadeUp>
          </div>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Fence", value: "Charcoal Colorbond — matches pool area" },
              { label: "Garden Bed", value: "Dark mulch, bromeliads, cordylines, clumping grasses" },
              { label: "Edging", value: "River rock border along garden bed" },
              { label: "Path Lighting", value: "Solar stake lights — warm amber, full length" },
              { label: "Shed", value: "Absco Space Saver WG30152SK, Woodland Grey — erected and anchored" },
              { label: "Path", value: "Slab poured 3–4 Oct — side access 16.1 m²" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 04 — Kitchen */}
      <section id="kitchen" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="04 — Kitchen" title="Kitchen" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <FadeUp delay={100}>
              <BeforeAfter before={ASSETS.before_kitchen} after={ASSETS.kitchen_pendants} />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Option A — With pendant lights</p>
            </FadeUp>
            <FadeUp delay={200}>
              <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                <img src={ASSETS.kitchen_clean} alt="Kitchen — downlights only" className="w-full h-72 md:h-[480px] object-cover transition-transform duration-700 hover:scale-[1.02]" />
              </div>
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Option B — Downlights only</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <p className="text-base leading-relaxed mb-10 max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              A full IKEA METOD kitchen in NICKEBO matt grey-green lower cabinets with VOXTORP matt white uppers and HEJSTA white/clear glass uppers on the peninsula side. The EKBACKEN light grey concrete effect benchtop and KILSVIKEN black quartz composite sink are the key material moments. The existing doorway between kitchen and living is removed to create a fully open-plan flow.
            </p>
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Lower Cabinets", value: "IKEA NICKEBO — matt grey-green" },
              { label: "Upper Cabinets (back)", value: "IKEA VOXTORP — matt white" },
              { label: "Upper Cabinets (island)", value: "IKEA HEJSTA — white frame / clear glass" },
              { label: "Benchtop", value: "IKEA EKBACKEN — light grey concrete effect. Still unpaid" },
              { label: "Splashback", value: "2× IKEA LYSEKIL panels — paid, due 17 Nov" },
              { label: "Sink", value: "IKEA KILSVIKEN — black quartz composite, 1 bowl" },
              { label: "Tap", value: "IKEA SALLSJÖN — black pull-out" },
              { label: "Oven", value: "IKEA SPJUTBO — pyrolytic, IKEA 300, black" },
              { label: "Cooktop", value: "IKEA KOLSTAN 500 — induction, black, 58cm" },
              { label: "Rangehood", value: "IKEA UNDERVERK — built-in, stainless, 60cm" },
              { label: "Handles", value: "IKEA BAGGANÄS — black knobs, 21mm" },
              { label: "Lighting", value: "MITTLED LED strips under uppers + pendant option" },
              { label: "Doorway", value: "Existing doorway removed — fully open to living" },
              { label: "IKEA Order", value: "$11,666.44 paid (234146073, incl. delivery) — arrives 17 Nov" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 05 — Bathrooms */}
      <section id="bathrooms" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="05 — Bathrooms" title="Ensuite & Main Bathroom" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <FadeUp delay={100}>
              <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                <img src={ASSETS.main_bathroom} alt="Main bathroom render" className="w-full h-72 md:h-[420px] object-cover transition-transform duration-700 hover:scale-[1.02]" />
              </div>
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Main Bathroom — oak vanity, dark concrete tiles, bath</p>
            </FadeUp>
            <FadeUp delay={200}>
              <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                <img src={ASSETS.ensuite} alt="Ensuite render" className="w-full h-72 md:h-[420px] object-cover transition-transform duration-700 hover:scale-[1.02]" />
              </div>
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Ensuite</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <p className="text-base leading-relaxed mb-10 max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              Both bathrooms are being fully renovated within a combined PC allowance. The main bathroom features large format dark concrete tiles, an oak floating vanity with vessel basin, backlit square mirror, and a bath/shower combination. The ensuite connects directly through the walk-in wardrobe from the master bedroom, creating a genuine suite sequence.
            </p>
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Main Bathroom Tiles", value: "Large format dark concrete — floor and shower wall" },
              { label: "Main Vanity", value: "Floating oak timber, vessel basin, backlit square mirror" },
              { label: "Main Bath", value: "Freestanding or inset bath with wall-mount tap" },
              { label: "Shower", value: "Frameless glass screen, rail shower + overhead" },
              { label: "Ensuite Tiles", value: "Large format — warm white / light grey" },
              { label: "Tapware", value: "Brushed nickel / matte black throughout" },
              { label: "Toilet", value: "Close-coupled — white" },
              { label: "Lighting", value: "Recessed downlights + backlit mirror" },
              { label: "Towel Rail", value: "Heated towel rail" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 06 — Laundry */}
      <section id="laundry" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="06 — Laundry" title="Laundry" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <FadeUp delay={100}>
              <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                <img src={ASSETS.laundry_white} alt="Laundry — white cabinets" className="w-full h-72 md:h-[420px] object-cover transition-transform duration-700 hover:scale-[1.02]" />
              </div>
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Option A — White shaker cabinets</p>
            </FadeUp>
            <FadeUp delay={200}>
              <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                <img src={ASSETS.laundry_oak} alt="Laundry — oak cabinets" className="w-full h-72 md:h-[420px] object-cover transition-transform duration-700 hover:scale-[1.02]" />
              </div>
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Option B — Oak timber cabinets</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <p className="text-base leading-relaxed mb-10 max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              Option A is the chosen laundry: white shaker cabinets, ordered with the kitchen. Both options share the same layout, dark concrete tile splashback and floor, wall-mounted dryer, and under-bench washing machine. Option B, warm oak shaker, is the earlier alternative and is not the order. Laundry floor and splashback tiles are meant to match the bathrooms and are not chosen yet.
            </p>
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Option A Cabinets", value: "White shaker — upper and lower" },
              { label: "Option B Cabinets", value: "Warm oak timber shaker — upper and lower" },
              { label: "Benchtop", value: "White laminate — both options" },
              { label: "Splashback", value: "Large format dark concrete tile" },
              { label: "Floor", value: "Dark concrete tile — matches splashback" },
              { label: "Dryer", value: "Wall-mounted above bench" },
              { label: "Washing Machine", value: "Under-bench, front-load" },
              { label: "Sink", value: "Inset laundry tub, right side" },
              { label: "Lighting", value: "Recessed downlights" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 07 — Lounge */}
      <section id="lounge" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="07 — Living Room" title="Living Room" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12 items-start">
            <FadeUp delay={100} className="lg:col-span-3">
              <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                <img src={ASSETS.lounge} alt="Lounge render" className="w-full h-72 md:h-[480px] object-cover transition-transform duration-700 hover:scale-[1.02]" />
              </div>
            </FadeUp>
            <FadeUp delay={200} className="lg:col-span-2">
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The lounge anchors the interior palette. White painted brick feature wall adds texture without colour, the floating oak TV unit grounds the space, and the warm mid-grey carpet flows through to all bedrooms. The matte black DC ceiling fan and recessed downlights replace the dated fitting. No feature wall paint — the design relies on material quality and furniture to create character.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Walls", value: "Dulux Natural White throughout" },
              { label: "Brick Wall", value: "Painted white — texture retained, colour unified" },
              { label: "Carpet", value: "Warm mid-grey — Feltex or Godfrey Hirst" },
              { label: "TV Unit", value: "Floating oak timber with matte black legs" },
              { label: "Ceiling Fan", value: "Matte black DC fan — no light fitting" },
              { label: "Lighting", value: "Recessed downlights — warm white 2700K" },
              { label: "Curtains", value: "Sheer linen + blockout roller blind" },
              { label: "Coffee Table", value: "Matte black frame, stone or glass top" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 08 — Hallway & Floors */}
      <section id="hallway" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="08 — Hallway & Flooring" title="Hallway & Flooring" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12 items-start">
            <FadeUp delay={100} className="lg:col-span-3">
              <BeforeAfter before={ASSETS.before_hallway} after={ASSETS.hallway} />
            </FadeUp>
            <FadeUp delay={200} className="lg:col-span-2">
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The existing honey-orange timber vinyl is replaced throughout the kitchen, hallway, and dining area with a natural European oak LVP — cooler, lighter, and more contemporary. The pale natural oak bridges the warm mid-grey carpet at every bedroom threshold without clashing, and the subtle timber grain reads as genuine rather than synthetic.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Product", value: "Karndean Van Gogh 'Classic Oak' or equivalent" },
              { label: "Alternatives", value: "Hybrid Flooring 'French Oak' / Quick-Step 'Natural Oak'" },
              { label: "Finish", value: "Matte — no gloss" },
              { label: "Tone", value: "Pale natural oak — no orange or yellow cast" },
              { label: "Areas", value: "Kitchen, hallway, dining, entry" },
              { label: "Transition", value: "Carpet to LVP at all bedroom doorways" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 09 — Master Bedroom */}
      <section id="master" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="09 — Master Bedroom" title="Master Bedroom" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12 items-start">
            <FadeUp delay={100} className="lg:col-span-3">
              <BeforeAfter before={ASSETS.before_master} after={ASSETS.master_bedroom} />
            </FadeUp>
            <FadeUp delay={200} className="lg:col-span-2">
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The master bedroom is resolved through furniture quality rather than wall treatments. A tall fluted upholstered bedhead in oatmeal linen becomes the visual anchor — sculptural and premium without any paint or wallpaper treatment. The palette flows directly from the lounge: warm mid-grey carpet, oak bedside tables, matte black fan and hardware.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Walls", value: "Dulux Natural White — no feature wall" },
              { label: "Bedhead", value: "Tall fluted upholstered — oatmeal linen fabric" },
              { label: "Carpet", value: "Warm mid-grey — continuous from lounge" },
              { label: "Bedside Tables", value: "Oak timber with matte black legs" },
              { label: "Bedside Lighting", value: "Matte black wall-mounted sconces" },
              { label: "Ceiling Fan", value: "Matte black DC fan — no light fitting" },
              { label: "Lighting", value: "Recessed downlights — warm white 2700K" },
              { label: "Window Treatment", value: "Blockout roller blind + sheer linen curtain" },
              { label: "Dresser", value: "Oak timber with matte black handles and mirror above" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 10 — Bedrooms 2 & 3 */}
      <section id="bedrooms" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="10 — Secondary Bedrooms" title="Bedrooms 2 & 3" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12 items-start lg:[direction:rtl]">
            <FadeUp delay={100} className="lg:col-span-3">
              <div className="[direction:ltr]">
                <BeforeAfter before={ASSETS.before_bedroom2} after={ASSETS.bedroom2} />
              </div>
            </FadeUp>
            <FadeUp delay={200} className="lg:col-span-2">
              <div className="[direction:ltr]">
                <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                  Bedrooms 2 and 3 share the same layout and design approach — cohesive with the master bedroom but self-contained. The oatmeal linen bedhead and warm mid-grey carpet create a calm, restful palette. White sliding robe doors with matte black handles span the full right wall.
                </p>
              </div>
            </FadeUp>
          </div>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Walls", value: "Dulux Natural White" },
              { label: "Bedhead", value: "Upholstered — oatmeal linen, queen size" },
              { label: "Carpet", value: "Warm mid-grey — same as master and lounge" },
              { label: "Built-in Robe", value: "Full-wall sliding doors — white with matte black handles" },
              { label: "Bedside Tables", value: "Oak timber, compact" },
              { label: "Ceiling Fan", value: "Matte black DC fan" },
              { label: "Lighting", value: "Recessed downlights — warm white 2700K" },
              { label: "Window Treatment", value: "Blockout roller blind + sheer linen curtain" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* Project Plan */}
      <section id="project-plan" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <FadeUp>
            <div className="mb-12">
              <span className="section-label mb-4 block">Project Approach</span>
              <h2 className="text-5xl md:text-6xl leading-none mb-8" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)" }}>How We're Doing This</h2>
              <p className="text-base leading-relaxed max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The renovation is structured as a series of independent mini-projects rather than one continuous build. Each phase has its own scope, budget, and trades — meaning work can progress without everything depending on everything else, and disruption to daily life stays manageable. The house is occupied throughout, with a business running from home, so the sequencing is deliberate.
              </p>
              <p className="text-base leading-relaxed max-w-3xl mt-4" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The guiding principle: <strong>outdoor work first, then kitchen, then interior rooms, then bathrooms last</strong>. Bathrooms are the later stage, around February–April 2027, with temporary facilities. There is no interior demolition before the 14–15 Nov visit. Demo on each phase is handled in-house. Trades are brought in for specialist work only.
              </p>
            </div>
          </FadeUp>

          {[
            {
              num: "01",
              title: "Pool Coping",
              timing: "Done — paid",
              body: "Done and paid. Project Dream Pools, $11,539.60. The confirmed quote was $10,939 inc. GST. Coping is not sealed yet; the plan is to have it sealed with the crazy paving after the grout cures."
            },
            {
              num: "02",
              title: "Pool Slab + Bench",
              timing: "Poured 3–4 Oct 2026 — bench in progress",
              body: "Composite decking is not the plan. The pool surround, pool-shed base, and side access were poured on 3–4 Oct 2026. Paid so far $4,133.54, including $1,350 cash to the pump crew. The main concrete supply and labour bill (about $8,500) is still outstanding. The pool bench is mostly built. The bottom paling row stays off until after tiling, and the decking row closest to the fence still needs ripping to fit."
            },
            {
              num: "Side Project",
              title: "Side Access",
              timing: "Rolling — slab poured, shed anchored",
              body: "Rolling, and underway. The 3–4 Oct pour included the side access slab, 16.1 m² (2.2 × 7.3). The Absco Space Saver shed (WG30152SK, Woodland Grey) was erected in October and anchored on the weekend of 7–8 Nov. Garden and path finishing continue with no hard deadline."
            },
            {
              num: "03",
              title: "Crazy Paving",
              timing: "Not started — no firm date",
              body: "Not started, and there is no firm laying date. Chosen system: Pool Tile Company Nimbus granite crazy pave, flamed finish, with Dunlop 20 kg Rubber Modified tile adhesive from Bunnings. About 40 m² for the pool surround. The patio is deferred. Leftover scrap still needs measuring before any extra stone is ordered."
            },
            {
              num: "04",
              title: "Pool Fence + Landscaping",
              timing: "Fence in — sunshade going back up",
              body: "The Colorbond fence and gate are in, paid $6,940.09. Landscaping is paid ($4,581.89) and the garden bed and palm removal are paid ($3,390.00). The back garden was set up by 8 Nov. The sunshade is going back up; the hardware was bought on 12 Nov."
            },
            {
              num: "05",
              title: "Kitchen",
              timing: "Paid — delivery 17 Nov 2026",
              body: "IKEA kitchen and laundry order 234146073 is paid ($11,666.44, including delivery) and arrives 17 Nov 2026. After delivery the priority is assembling cabinet shells in the garage. Demolition and installation are not booked, and there is no interior demo before the 14–15 Nov visit. Splashbacks (2× LYSEKIL, $134.30) arrive the same day. Benchtops and some panels are still unpaid, about $1,083 at full price."
            },
            {
              num: "06",
              title: "Bedroom 4 + Plastering",
              timing: "After the kitchen",
              body: "Not started. The office stays in Bedroom 2 while outdoor work is the focus. Bedroom 4 becomes the second office and character room. A new wall, doorway, and door still create Bedroom 4, and the Bedroom 3 door opening is filled. DIY framing with chippy mates, then a plasterer for sheeting, setting, and whole-house ceiling touch-ups. This waits until after the kitchen."
            },
            {
              num: "07",
              title: "Lounge + Bedrooms Interior",
              timing: "After the kitchen",
              body: "Done room by room. Sequence within each room: plasterboard repairs → paint (Dulux Natural White throughout) → replace architraves → replace ceiling fans (matte black DC) → update cupboard doors (DIY). Room order: Lounge first, then Master (temporarily move into Bedroom 3), then Bedrooms 3 & 4 simultaneously (back in master), then Bedroom 2 / home office last (move into Bedroom 4). Carpet ordered in full at the start — single dye lot, held by supplier, installed in two visits. LVP flooring (kitchen, hallway, entry) laid last: existing vinyl stripped DIY, supply + install with a mate."
            },
            {
              num: "08",
              title: "Bathrooms + Laundry",
              timing: "Feb–Apr 2027",
              body: "Later stage, after the kitchen, with temporary facilities. The bathroom package went to Jason (plumber) and John (builder) on 30 Sep. ShawCon Projects builds both bathrooms — quote $45,300 inc. GST. Plumbing quote $7,485 inc. GST. Laundry floor and splashback tiles are meant to match the bathrooms and are not chosen yet. Laundry cabinetry is already on the paid IKEA order."
            },
            {
              num: "09",
              title: "Exterior",
              timing: "Rolling throughout 2026",
              body: "The front retaining wall is done. Roof paint has not started: allowance $3–6k, not on the critical path, colour leaning Monument. The lean is Perfect Glaze Option 3 ($6,300 inc. GST), with Colour Seal as the fallback. Gutters are Jeremy's plumber, not part of the roof job, and a rusted section still needs a quote. Other exterior painting and the front garden are still DIY. The driveway stays as-is."
            },
          ].map((phase, i) => (
            <FadeUp key={i} delay={i * 60}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
                <div className="md:col-span-1">
                  <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.1rem", color: "oklch(0.62 0.015 60)", fontWeight: 300 }}>{phase.num}</span>
                </div>
                <div className="md:col-span-3">
                  <div className="text-base font-medium mb-1" style={{ color: "oklch(0.22 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{phase.title}</div>
                  <div className="text-xs" style={{ color: "oklch(0.48 0.06 155)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, letterSpacing: "0.05em" }}>{phase.timing}</div>
                </div>
                <div className="md:col-span-8">
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>{phase.body}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Budget */}
      <section id="budget" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <FadeUp>
            <span className="section-label mb-4 block">Project Budget</span>
            <h2 className="text-5xl md:text-6xl leading-none mb-4" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)" }}>Budget Overview</h2>
            <p className="text-base leading-relaxed max-w-3xl mb-12" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              Estimates include supply and labour where applicable. DIY labour is not costed. Bathroom and plumbing figures are based on confirmed quotes. Pool coping based on confirmed quote. All other figures are provisional allowances pending formal quotes.
            </p>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
                    <th className="py-3 text-left pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Phase</th>
                    <th className="py-3 text-left pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Scope</th>
                    <th className="py-3 text-left pr-4 hidden md:table-cell" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Approach</th>
                    <th className="py-3 text-right" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Estimate</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { phase: "1 — Pool Coping", scope: "Remove & replace 27lm stone coping + hide slimmer lid", approach: "Trade", estimate: "$10,939", confirmed: true },
                    { phase: "2 — Pool Slab + Bench", scope: "Pool surround slab and timber bench. Main concrete bill still outstanding", approach: "Trade + DIY", estimate: "$8,000 – $12,000", confirmed: false },
                    { phase: "Side — Side Access", scope: "Side access slab poured, Absco shed anchored, garden still rolling", approach: "DIY + Trade (slab)", estimate: "$1,500 – $2,200", confirmed: false },
                    { phase: "3 — Crazy Paving", scope: "About 40 m² Nimbus granite crazy pave. Not started", approach: "DIY", estimate: "$4,800 – $5,500", confirmed: false },
                    { phase: "4 — Pool Fence + Landscaping", scope: "Colorbond fence and gate in. Landscaping paid. Sunshade going back up", approach: "DIY", estimate: "$2,500 – $4,000", confirmed: false },
                    { phase: "5 — Kitchen", scope: "IKEA supply + installer + electrical + plumbing", approach: "Trade + DIY demo", estimate: "$17,500 – $20,000", confirmed: false },
                    { phase: "6 — Bedroom 4 + Plastering", scope: "Framing, doors, plaster, ceiling touch-ups whole house", approach: "DIY + Trade", estimate: "$3,000 – $5,000", confirmed: false },
                    { phase: "7 — Lounge + Bedrooms", scope: "Carpet, paint, fans, architraves, cupboard doors, LVP flooring", approach: "DIY + Trade (carpet, LVP supply)", estimate: "$11,100 – $16,100", confirmed: false },
                    { phase: "8 — Bathrooms + Laundry", scope: "Full build — both bathrooms + laundry", approach: "Builder + Plumber", estimate: "$53,000 – $57,000", confirmed: true },
                    { phase: "9 — Exterior", scope: "Retaining wall done. Roof paint not started. Driveway stays as-is", approach: "Trade + DIY", estimate: "$6,000 – $10,000", confirmed: false },
                  ].map((row, i) => (
                    <tr key={i} className="border-b" style={{ borderColor: "oklch(0.92 0.008 75)" }}>
                      <td className="py-3 pr-4 whitespace-nowrap" style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.8rem" }}>
                        <div className="flex items-center gap-2">
                          {row.phase}
                          {row.confirmed && <span style={{ fontSize: "0.6rem", background: "oklch(0.88 0.04 155)", color: "oklch(0.32 0.06 155)", padding: "1px 6px", borderRadius: "100px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quoted</span>}
                        </div>
                      </td>
                      <td className="py-3 pr-4" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, fontSize: "0.8rem" }}>{row.scope}</td>
                      <td className="py-3 pr-4 hidden md:table-cell" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, fontSize: "0.8rem" }}>{row.approach}</td>
                      <td className="py-3 text-right whitespace-nowrap" style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.8rem" }}>{row.estimate}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "oklch(0.95 0.008 75)" }}>
                    <td className="py-4 pr-4" colSpan={2} style={{ color: "oklch(0.22 0.025 55)", fontFamily: "Fraunces, Georgia, serif", fontSize: "1rem", fontWeight: 400 }}>Total Project Estimate</td>
                    <td className="py-4 pr-4 hidden md:table-cell"></td>
                    <td className="py-4 text-right" style={{ color: "oklch(0.22 0.025 55)", fontFamily: "Fraunces, Georgia, serif", fontSize: "1rem", fontWeight: 400 }}>$118,000 – $142,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Investment Case */}
      <section id="investment" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <FadeUp>
            <span className="section-label mb-4 block">Investment Justification</span>
            <h2 className="text-5xl md:text-6xl leading-none mb-8" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)" }}>The Investment Case</h2>
            <p className="text-base leading-relaxed max-w-3xl mb-4" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              This is not a forever home renovation. Every decision has been made through the lens of <strong>"Premium Economy"</strong> — the sweet spot between a basic rental and a premium property that commands top-of-market rent without overcapitalising. Victoria Point is a suburb where that distinction matters enormously.
            </p>
            <p className="text-base leading-relaxed max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              Victoria Point renters in the $780–$850/week bracket are comparing this property against new builds in the suburb's growth corridors. The 1,002m² block, the pool, and the granny flat are the differentiators that new builds can't replicate. The renovation is what makes those differentiators visible.
            </p>
          </FadeUp>

          {/* Suburb Snapshot */}
          <FadeUp delay={100}>
            <div className="mt-16 mb-4">
              <span className="section-label block mb-3">Victoria Point 4165 — Suburb Snapshot</span>
              <p className="text-sm leading-relaxed max-w-2xl mb-8" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                Victoria Point sits on the Redland Bay peninsula, approximately 35km south-east of Brisbane CBD. A predominantly owner-occupier suburb with a median resident age of 49, strong family household composition (76% family households), and consistent demand from both owner-occupiers and renters seeking lifestyle, schools, and bay access without inner-city prices.
              </p>
            </div>
            <div className="border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
                    <th className="py-3 text-left pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Metric</th>
                    <th className="py-3 text-left pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Figure</th>
                    <th className="py-3 text-left hidden md:table-cell" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "Median house price (all houses)", figure: "$1,035,000", source: "REA, Feb 2025–Jan 2026" },
                    { metric: "12-month price growth", figure: "+9.5%", source: "REA, Jan 2026" },
                    { metric: "3 bedroom median", figure: "$947,500", source: "REA / property.com.au" },
                    { metric: "4 bedroom median", figure: "$1,050,000", source: "REA / property.com.au" },
                    { metric: "Median days on market", figure: "28 days", source: "REA" },
                    { metric: "Active buyers per listing", figure: "57:1 ratio", source: "REA (1,893 buyers, 33 listings)" },
                    { metric: "Median house rent (all)", figure: "$725/week", source: "REA, 341 listings" },
                    { metric: "4 bedroom median rent", figure: "$760–$800/week", source: "REA live listings, Feb 2026" },
                    { metric: "Rental demand growth", figure: "+63% year-on-year", source: "REA" },
                    { metric: "Gross rental yield", figure: "3.6%", source: "REA" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b" style={{ borderColor: "oklch(0.92 0.008 75)" }}>
                      <td className="py-3 pr-4" style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 400, fontSize: "0.82rem" }}>{row.metric}</td>
                      <td className="py-3 pr-4" style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600, fontSize: "0.82rem" }}>{row.figure}</td>
                      <td className="py-3 hidden md:table-cell" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, fontSize: "0.78rem" }}>{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>

          {/* Valuation Uplift */}
          <FadeUp delay={150}>
            <div className="mt-16 mb-4">
              <span className="section-label block mb-3">Valuation Uplift</span>
              <p className="text-sm leading-relaxed max-w-2xl mb-8" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The property was independently valued at $1.18M in May 2025 (3 bed / 1 bath / 1,002m²). Applying the suburb's 9.5% annual growth rate pro-rated to February 2026 (9 months ≈ +7.1%), the current estimated value is approximately $1.265M before renovation. The renovation converts the property to a 4-bedroom, 2-bathroom home with pool — a meaningful category shift in the Victoria Point market.
              </p>
            </div>
            <div className="border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
                    <th className="py-3 text-left pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Scenario</th>
                    <th className="py-3 text-left pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Estimated Value</th>
                    <th className="py-3 text-left hidden md:table-cell" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { scenario: "May 2025 (at purchase / valuation)", value: "$1,180,000", basis: "Independent valuation, 3br / 1ba / 1,002m²", highlight: false },
                    { scenario: "Current (pre-reno, Feb 2026)", value: "~$1,265,000", basis: "$1.18M + 9.5% annual growth pro-rated 9 months", highlight: false },
                    { scenario: "Post-renovation (4br / 2ba / pool)", value: "$1,380,000 – $1,500,000", basis: "4br median $1.05M + 1,002m² block premium + pool + granny flat + full reno", highlight: true },
                    { scenario: "Renovation cost", value: "$118,000 – $142,000", basis: "Project budget", highlight: false },
                    { scenario: "Net uplift (low case)", value: "~$0 – $15,000", basis: "Breaks even on paper; real return is rental uplift + vacancy risk removal", highlight: false },
                    { scenario: "Net uplift (high case)", value: "~$93,000", basis: "$1.50M – $1.265M – $142K", highlight: false },
                  ].map((row, i) => (
                    <tr key={i} className="border-b" style={{ borderColor: "oklch(0.92 0.008 75)", background: row.highlight ? "oklch(0.95 0.012 155 / 0.3)" : "transparent" }}>
                      <td className="py-3 pr-4" style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: row.highlight ? 600 : 400, fontSize: "0.82rem" }}>{row.scenario}</td>
                      <td className="py-3 pr-4" style={{ color: row.highlight ? "oklch(0.38 0.08 155)" : "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600, fontSize: "0.82rem" }}>{row.value}</td>
                      <td className="py-3 hidden md:table-cell" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, fontSize: "0.78rem" }}>{row.basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>

          {/* Rental Projection */}
          <FadeUp delay={200}>
            <div className="mt-16 mb-4">
              <span className="section-label block mb-3">Rental Projection</span>
              <p className="text-sm leading-relaxed max-w-2xl mb-8" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The current 3-bed / 1-bath configuration was renting at $625/week and described as difficult to place. Post-renovation, the property becomes a 4-bed / 2-bath with pool, new kitchen, and modern finishes — a genuinely different product in the rental market. At $800/week, the renovation pays back in rental income alone in approximately 10–15 years, but the real return is the combination of rental uplift, capital growth, and the removal of vacancy risk.
              </p>
            </div>
            <div className="border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
                    <th className="py-3 text-left pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Configuration</th>
                    <th className="py-3 text-left pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Weekly Rent</th>
                    <th className="py-3 text-left pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Annual Rent</th>
                    <th className="py-3 text-left hidden md:table-cell" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { config: "Current (3br / 1ba, pre-reno)", weekly: "$625", annual: "$32,500", basis: "Actual — described as hard to rent", highlight: false },
                    { config: "Post-renovation (4br / 2ba / pool)", weekly: "$780 – $850", annual: "$40,560 – $44,200", basis: "REA live 4br listings: $690–$950/wk range, median ~$790", highlight: true },
                    { config: "Annual rental uplift", weekly: "+$155 – $225", annual: "+$8,060 – $11,700", basis: "", highlight: false },
                  ].map((row, i) => (
                    <tr key={i} className="border-b" style={{ borderColor: "oklch(0.92 0.008 75)", background: row.highlight ? "oklch(0.95 0.012 155 / 0.3)" : "transparent" }}>
                      <td className="py-3 pr-4" style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: row.highlight ? 600 : 400, fontSize: "0.82rem" }}>{row.config}</td>
                      <td className="py-3 pr-4" style={{ color: row.highlight ? "oklch(0.38 0.08 155)" : "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600, fontSize: "0.82rem" }}>{row.weekly}</td>
                      <td className="py-3 pr-4" style={{ color: row.highlight ? "oklch(0.38 0.08 155)" : "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.82rem" }}>{row.annual}</td>
                      <td className="py-3 hidden md:table-cell" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, fontSize: "0.78rem" }}>{row.basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-6 max-w-2xl" style={{ color: "oklch(0.58 0.015 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300, lineHeight: 1.7 }}>
              All figures are estimates based on publicly available market data (realestate.com.au, domain.com.au, property.com.au) as at February 2026. Valuation uplift projections are indicative only and subject to market conditions at time of sale or formal valuation. Rental projections are based on comparable listings and should be confirmed with a property manager prior to listing.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-2xl mb-1" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)", fontWeight: 400 }}>14 Prescoter Drive</div>
            <div className="text-sm" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>Victoria Point, QLD — Renovation Design Presentation</div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/tracker" style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "oklch(0.48 0.06 155)", letterSpacing: "0.04em", textDecoration: "none" }}>Project Tracker →</Link>
            <div className="text-xs" style={{ color: "oklch(0.62 0.015 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>Prepared February 2026</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
