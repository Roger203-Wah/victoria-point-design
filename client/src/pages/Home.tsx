/*
  DESIGN PHILOSOPHY: Warm Minimal Studio
  - Warm linen bg / deep warm brown headings / sage green accents
  - Fraunces display serif + Plus Jakarta Sans body
  - Scroll-triggered fade-in animations
  - Before/After toggle on key spaces
*/

import React, { useEffect, useRef, useState } from "react";

// CDN URLs for all render assets
const ASSETS = {
  // Renders (after)
  front_facade: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/zurpoWLKDZrdLGaC.png",
  side_access: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/aQdNUFVvfBpRTbCV.png",
  lounge: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/lNPjrvQARSSiQBHY.png",
  master_bedroom: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/axjSIlhcABFTdSKs.png",
  bedroom2: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/mUlMLfRYAULNIbem.png",
  kitchen_pendants: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/hQnThuiKjtYaoTsx.png",
  kitchen_clean: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/zdmtasgohuGKZLNP.png",
  hallway: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/dNJnCGkJgobNOmOl.png",
  // Pool — after renders (new)
  pool_after_deck: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/UsRsagXZcBpCfJqM.jpg",
  pool_after_patio: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/XhNNkaHxanEgGxoK.png",
  // Pool — before photos (new)
  pool_before_1: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/UinUHjYNXgbaDGTL.jpeg",
  pool_before_2: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/QRcGYphhUQwDNpRP.jpeg",
  // Bathrooms (new renders)
  main_bathroom: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/NclUswMBaHVEOdzV.png",
  ensuite: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/LkTeaAEIOcxvrsOV.png",
  // Laundry
  laundry_white: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/JMzLvSvvLSqBqRjF.png",
  laundry_oak: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/gJVHqMHSxcBegrIN.jpg",
  // Before photos
  before_facade: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/KCxwoohWrSkiCsyH.jpeg",
  before_master: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/sFvSaTADHXsJDIoj.jpeg",
  before_kitchen: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/PWjcQazhRSkQAhJA.jpeg",
  before_hallway: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/DXzGVDecvTTZVVap.jpeg",
  before_bedroom2: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/tojEzXWuLWeldIap.jpeg",
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
function BeforeAfter({ before, after, beforeLabel = "Before", afterLabel = "After" }: {
  before: string; after: string; beforeLabel?: string; afterLabel?: string;
}) {
  const [showBefore, setShowBefore] = useState(false);
  return (
    <div className="relative overflow-hidden" style={{ borderRadius: "2px" }}>
      <img
        src={showBefore ? before : after}
        alt={showBefore ? beforeLabel : afterLabel}
        className="w-full h-72 md:h-[480px] object-cover transition-opacity duration-300"
      />
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
          After
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
          Before
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
      <nav className="sticky top-0 z-50 border-b hidden lg:block" style={{ background: "oklch(0.965 0.008 75 / 0.95)", backdropFilter: "blur(12px)", borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container flex items-center justify-between h-14">
          <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.95rem", color: "oklch(0.22 0.025 55)", fontWeight: 400 }}>
            14 Prescoter Drive
          </span>
          <div className="flex items-center gap-5 flex-wrap">
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
                The existing red brick is retained as the hero material — warm, textural, and distinctive. Everything around it is resolved in a unified charcoal palette: Colorbond Ironstone roof, charcoal panel-lift garage door, charcoal rendered retaining wall, and charcoal fascia and window frames. The result is a deliberate, contemporary facade that photographs exceptionally well for rental listings.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Roof", value: "Colorbond Ironstone — repaint existing" },
              { label: "Garage Door", value: "Charcoal panel-lift, horizontal ribbing" },
              { label: "Retaining Wall", value: "Smooth charcoal render over existing timber sleepers" },
              { label: "Fascia & Eaves", value: "Charcoal — all trim unified" },
              { label: "Window Frames", value: "Charcoal — consistent with trim" },
              { label: "Front Door", value: "Matte black" },
              { label: "Entry Lighting", value: "Matte black wall sconces flanking door" },
              { label: "Driveway", value: "Exposed aggregate concrete — replace loose gravel" },
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
              <BeforeAfter before={ASSETS.pool_before_1} after={ASSETS.pool_after_deck} />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Deck perspective — looking from garden toward house</p>
            </FadeUp>
            <FadeUp delay={200}>
              <BeforeAfter before={ASSETS.pool_before_2} after={ASSETS.pool_after_patio} />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Patio perspective — looking out to pool and yard</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <p className="text-base leading-relaxed mb-10 max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              The pool area establishes the outdoor design language that flows through the side access and to the street. Dark composite decking, charcoal Colorbond fencing, tropical low-maintenance planting in dark mulch, and warm festoon lighting create a resort-style outdoor living space. The charcoal palette ties directly to the exterior facade.
            </p>
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Decking", value: "Dark composite — Trex or equivalent" },
              { label: "Fence", value: "Charcoal Colorbond — pool compliant" },
              { label: "Pool Fence", value: "Black aluminium pool fence" },
              { label: "Shade Sail", value: "Black shade sail over pool area" },
              { label: "Pergola", value: "Dark timber/steel pergola with festoon lights" },
              { label: "Planting", value: "Bromeliads, cordylines, clumping grasses — dark mulch" },
              { label: "Lighting", value: "Warm festoon lights + deck step lights" },
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
                <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                  <img src={ASSETS.side_access} alt="Side access render" className="w-full h-72 md:h-[480px] object-cover transition-transform duration-700 hover:scale-[1.02]" />
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={200} className="lg:col-span-2">
              <div className="[direction:ltr]">
                <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                  The side passage connects the street to the pool area and is designed as a cohesive extension of the backyard palette. Dark charcoal Colorbond fence, tropical low-maintenance planting in dark mulch, and warm solar stake path lights create a designed corridor rather than a forgotten utility passage.
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
              { label: "Shed", value: "Slimline charcoal shed at far end" },
              { label: "Path", value: "Existing concrete retained and cleaned" },
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
              { label: "Benchtop", value: "IKEA EKBACKEN — light grey concrete effect laminate" },
              { label: "Splashback", value: "Light grey vertical subway tile, mid-grey grout" },
              { label: "Sink", value: "IKEA KILSVIKEN — black quartz composite, 1 bowl" },
              { label: "Tap", value: "IKEA DELSJÖN — brushed black metal mixer" },
              { label: "Oven", value: "IKEA BRÄNDBO 500 — forced air, black, built-under" },
              { label: "Cooktop", value: "IKEA KOLSTAN 500 — induction, black, 58cm" },
              { label: "Rangehood", value: "IKEA UNDERVERK — built-in, stainless, 60cm" },
              { label: "Handles", value: "IKEA BAGGANÄS — black knobs, 21mm" },
              { label: "Lighting", value: "MITTLED LED strips under uppers + pendant option" },
              { label: "Doorway", value: "Existing doorway removed — fully open to living" },
              { label: "IKEA Total", value: "$13,315.97 (self-collect, excl. delivery & install)" },
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
          <SectionHeader label="06 — Laundry" title="Laundry" status="options" />
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
              Two options are presented for the laundry. Both share the same layout, dark concrete tile splashback and floor, wall-mounted dryer, and under-bench washing machine. Option A in white shaker cabinets keeps the laundry cohesive with the kitchen's white upper cabinets. Option B in warm oak timber ties to the natural oak flooring and furniture used throughout the house. Both are strong choices — the decision comes down to whether you want the laundry to feel like an extension of the kitchen or the bedroom palette.
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

      {/* Footer */}
      <footer className="py-16 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-2xl mb-1" style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)", fontWeight: 400 }}>14 Prescoter Drive</div>
            <div className="text-sm" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>Victoria Point, QLD — Renovation Design Presentation</div>
          </div>
          <div className="text-xs" style={{ color: "oklch(0.62 0.015 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>Prepared February 2026</div>
        </div>
      </footer>
    </div>
  );
}
