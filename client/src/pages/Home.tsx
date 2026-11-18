/*
  DESIGN PHILOSOPHY: Warm Minimal Studio
  - Warm linen bg / deep warm brown headings / sage green accents
  - Fraunces display serif + Plus Jakarta Sans body
  - Scroll-triggered fade-in animations
  - Before/After toggle on key spaces
*/

import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ImageSlider, type ImageSlide } from "@/components/ImageSlider";

// Public files keep their names. BASE_URL is "/" locally and the repo path on GitHub Pages.
const publicAsset = (file: string) =>
  `${import.meta.env.BASE_URL}${file.replace(/^\//, "")}`;

// Presentation images served from client/public/images
const ASSETS = {
  // Renders (after)
  front_facade: publicAsset("images/front_facade.webp"),
  lounge: publicAsset("images/lounge.webp"),
  master_bedroom: publicAsset("images/master_bedroom.webp"),
  bedroom2: publicAsset("images/bedroom2.webp"),
  kitchen_locked: publicAsset("images/kitchen_locked.webp"),
  // Bathrooms (new renders)
  main_bathroom: publicAsset("images/main_bathroom.webp"),
  ensuite: publicAsset("images/ensuite.webp"),
  // Before photos
  before_facade: publicAsset("images/before_facade.webp"),
  before_master: publicAsset("images/before_master.webp"),
  master_wardrobe_before: publicAsset("images/master_wardrobe_before_1.webp"),
  master_walkin_after: publicAsset("images/master_walkin_after.webp"),
  before_kitchen: publicAsset("images/before_kitchen.webp"),
  before_bedroom2: publicAsset("images/before_bedroom2.webp"),
};

// Viewing order for the pool sliders. Both sets share one 3:4 cover frame.
const POOL_BEFORE_SLIDES: ImageSlide[] = [
  { src: publicAsset("images/pool_before_1_wide_from_lawn.webp"), alt: "Pool before, wide view from the lawn" },
  { src: publicAsset("images/pool_before_2_from_patio.webp"), alt: "Pool before, view from the patio" },
  { src: publicAsset("images/pool_before_3_back_corner_sleepers.webp"), alt: "Pool before, back corner and timber sleepers" },
  { src: publicAsset("images/pool_before_4_right_fence_to_house.webp"), alt: "Pool before, right fence toward the house" },
];

const SIDE_BEFORE_SLIDES: ImageSlide[] = [
  { src: publicAsset("images/side_before_1_bins_and_pavers.webp"), alt: "Side passage before, bins and pavers" },
  { src: publicAsset("images/side_before_2_garden_bed_and_path.webp"), alt: "Side passage before, garden bed and path" },
];

const SIDE_AFTER_SLIDES: ImageSlide[] = [
  { src: publicAsset("images/side_after_1_passage.webp"), alt: "Side passage after, locked design" },
  { src: publicAsset("images/side_after_2_shed_slab.webp"), alt: "Side passage after: Monument garden bed and full slab from the shed to the house" },
  { src: publicAsset("images/side_after_3_gate_bins.webp"), alt: "Side access after: full slab to the gate, timber fence painted Monument, three bins neatly against the gate" },
];

const OFFICE_BEFORE_SLIDES: ImageSlide[] = [
  { src: publicAsset("images/office_before_1.webp"), alt: "Office before: open robe, white walls, white fan, whiteboard" },
  { src: publicAsset("images/office_before_2.webp"), alt: "Office before: desk facing the robe wall" },
];

const OFFICE_AFTER_SLIDES: ImageSlide[] = [
  { src: publicAsset("images/office_after_1_window_slats.webp"), alt: "Office after: Magic Forest green, walnut slat backdrop wall, recessed wardrobe" },
  { src: publicAsset("images/office_after_2_wardrobe.webp"), alt: "Office after: recessed walnut and green built-in wardrobe" },
];

const LAUNDRY_BEFORE_SLIDES: ImageSlide[] = [
  { src: publicAsset("images/laundry_before_1.webp"), alt: "Laundry before: dryer on wall, washer and old tub, timber floor" },
];

const LAUNDRY_AFTER_SLIDES: ImageSlide[] = [
  { src: publicAsset("images/laundry_after_oak_subway.webp"), alt: "Laundry after: white shaker cabinets, grey concrete-look benchtop, white subway tile splashback, oak floor" },
];

const POOL_AFTER_SLIDES: ImageSlide[] = [
  { src: publicAsset("images/pool_after_1_view.webp"), alt: "Pool after, locked design, view across the lawn to the pool" },
  { src: publicAsset("images/pool_after_2_corner.webp"), alt: "Pool after, locked design, paved corner and pool bench" },
  { src: publicAsset("images/pool_after_3_shed_slats.webp"), alt: "Pool after, locked design, shed screen and shade sail" },
];

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

// Small budget line other sections can reuse. status is green, amber, or red.
function BudgetIndicator({
  amount,
  status,
  className = "",
}: {
  amount: string;
  status: "green" | "amber" | "red";
  className?: string;
}) {
  return (
    <div className={`budget-status ${className}`.trim()} data-status={status}>
      <span className="budget-status-dot" aria-hidden="true" />
      Budget {amount}
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
    { id: "entrance", label: "Entrance" },
    { id: "pool", label: "Pool & Outdoor" },
    { id: "back-patio", label: "Back Covered Patio" },
    { id: "side-access", label: "Side Passage" },
    { id: "kitchen", label: "Kitchen" },
    { id: "bathrooms", label: "Bathrooms" },
    { id: "laundry", label: "Laundry" },
    { id: "lounge", label: "Living Room" },
    { id: "master", label: "Master Bedroom" },
    { id: "bedrooms", label: "Bedrooms 2 & 3" },
    { id: "bedroom-4", label: "Bedroom 4 / Office" },
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <FadeUp delay={100}>
              <ImageSlider
                slides={[
                  { src: publicAsset("images/before_facade_original.webp"), alt: "Street front before landscaping" },
                  { src: ASSETS.before_facade, alt: "Street front before" },
                ]}
                label="Before"
                frameClassName="h-72 md:h-[480px] w-full"
              />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Before</p>
            </FadeUp>
            <FadeUp delay={200}>
              <ImageSlider
                slides={[{ src: ASSETS.front_facade, alt: "Street front after" }]}
                label="After, locked design"
                frameClassName="h-72 md:h-[480px] w-full"
              />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>After, locked design</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <p className="text-base leading-relaxed max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              This is an older brick home getting a modern makeover. The biggest change is the landscaping. We built a retaining wall just below the maximum allowed height, which turned the whole sloped, unusable front into a flat, defined lawn that frames the house. We're keeping the red brick rather than rendering over it, and lifting the whole front with colour instead. The roof is being repainted in Monument, with charcoal on the garage door, fascia, window frames and the rendered retaining wall. The result is a fresh, contemporary look that keeps the warmth and character of the original brick.
            </p>
            <BudgetIndicator amount="$20,000" status="green" className="mt-4 mb-10" />
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Roof", value: "Being repainted in Monument" },
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
              { label: "Budget", value: "$20,000: roof repaint, colour uplift and front landscaping" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* Entrance */}
      <section id="entrance" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="Entrance" title="Entrance" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <FadeUp delay={100}>
              <ImageSlider
                slides={[{ src: publicAsset("images/before_entrance.webp"), alt: "Entrance before" }]}
                label="Before"
                frameClassName="aspect-[3/4] w-full"
              />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Before</p>
            </FadeUp>
            <FadeUp delay={200}>
              <ImageSlider
                slides={[{ src: publicAsset("images/after_entrance.webp"), alt: "Entrance after" }]}
                label="After"
                frameClassName="aspect-[3/4] w-full"
              />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>After</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <p className="text-base leading-relaxed max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              The entrance gets a simple, low-cost refresh to tie in with the new street look. We're laying the same Nimbus crazy pave from the pool area straight over the old orange tiles and the step, so the front and back of the house feel connected. The rest is a good clean up: the old awning comes off, the screen door and side slats go charcoal, the ceiling is painted Natural White, and new black lighting goes in by the door and overhead. A couple of black pots and fresh white pebbles finish it off. The red brick stays, and the driveway concrete runs right up to the new step.
            </p>
            <BudgetIndicator amount="$1,500" status="green" className="mt-4 mb-10" />
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Budget", value: "$1,500: mainly the crazy pave and clean up" },
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
              <ImageSlider slides={POOL_BEFORE_SLIDES} label="Before" />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Before</p>
            </FadeUp>
            <FadeUp delay={200}>
              <ImageSlider slides={POOL_AFTER_SLIDES} label="After — locked design" />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>After — locked design</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <div className="max-w-3xl space-y-4">
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                This is the most important upgrade in the house. Plenty of homes nearby are new four bed, two bath builds, but very few have a properly designed outdoor space. The house is an older brick home, and adding the fourth bedroom took up a lot of room inside. So the backyard needed to become a really usable retreat that shows off the big pool and flows from the house, so the whole place feels bigger.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                We needed a retaining wall to hold up the walkway built for the back house. Instead of a plain wall, we built a 20 m bench. It has plumbed drainage, heaps of seating and spots for plants, and it frames the whole space for a real wow factor.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The Nimbus granite crazy pave is the feature, and we invested heavily in it. It set the colour palette for everything else, with Monument fencing, bench and roof keeping a darker backdrop that makes the stone and water stand out. A slatted Monument pool shed screen separates the area and hides storage. It also marks the line between the raised pool area and the existing concrete slab. Sparse star jasmine on wires softens the fences without taking over.
              </p>
            </div>
            <BudgetIndicator amount="$35,000" status="green" className="mt-4 mb-10" />
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Coping", value: "Light grey Nimbus, done and paid (Project Dream Pools). To be sealed together with the paving" },
              { label: "Paving", value: "Nimbus granite crazy pave, flamed, about 40 m², butted tight to the coping. Not laid yet" },
              { label: "Pool bench", value: "Monument, one continuous run on the back and side fences. Mostly built; bottom palings go on after tiling" },
              { label: "Bench planting", value: "Four pockets, flush with the seat: two aloe and small flower pockets, a small tree in the back corner and a small tree in the end planter" },
              { label: "Fence planting", value: "Sparse trailing star jasmine on wires" },
              { label: "Shed", value: "Absco Space Saver WG30152SK, Woodland Grey, erected and anchored" },
              { label: "Shed screen", value: "Monument vertical slats running across to the right fence. First section in, rest in progress" },
              { label: "Fence", value: "Monument Colorbond fence and gate, done" },
              { label: "Pool fence", value: "Black, on the grass and tile line" },
              { label: "Shade sail", value: "Existing sail going back up over the pool" },
              { label: "Roof", value: "Monument, to be painted (quotes underway)" },
              { label: "Lawn", value: "Sir Walter buffalo, rear yard, cleaned up" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* Back Covered Patio */}
      <section id="back-patio" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="Back Covered Patio" title="Back Covered Patio" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <FadeUp delay={100}>
              <ImageSlider
                slides={[{ src: publicAsset("images/before_patio.webp"), alt: "Back covered patio before" }]}
                label="Before"
                frameClassName="aspect-[3/4] w-full"
              />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Before</p>
            </FadeUp>
            <FadeUp delay={200}>
              <ImageSlider
                slides={[{ src: publicAsset("images/after_patio.webp"), alt: "Back covered patio after" }]}
                label="After"
                frameClassName="aspect-[3/4] w-full"
              />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>After</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <p className="text-base leading-relaxed max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              The back covered patio gets a refresh rather than a rebuild. The pool area does the heavy lifting for seating, so this space is about good light and an easy, tidy covered spot to walk into. All the beams, roof, posts, eaves and window trims are painted Monument to match the rest of the outdoors, and modern black downlights and wall lights replace the old fittings. The concrete gets a proper clean, a small strip of grass leads up to the slab, and the black pool fence turns neatly into the brick. We're keeping the wicker sofa, BBQ and dining table, and adding a simple round coffee table and a small rug.
            </p>
            <BudgetIndicator amount="$1,500" status="green" className="mt-4 mb-10" />
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Budget", value: "$1,500: paint, lighting and clean up" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 03 — Side Access */}
      <section id="side-access" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="03 — Side Access" title="Side Passage" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <FadeUp delay={100}>
              <ImageSlider slides={SIDE_BEFORE_SLIDES} label="Before" />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Before</p>
            </FadeUp>
            <FadeUp delay={200}>
              <ImageSlider slides={SIDE_AFTER_SLIDES} label="After — locked design" />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>After — locked design</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <div className="max-w-3xl space-y-4">
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                Making the pool area the hero meant the rest of the yard had to work harder. The side passage runs from the back of the house towards the street, and it was mostly wasted space: a huge, tired garden bed, loose gravel, weeds and bins along a rotten fence. We wanted it to be useful but still a nice place to walk through.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                The big garden bed is being turned into a vege and fruit garden that doubles as a clean feature. The rotten fence was replaced, which was a big fix. Near the street gate we put down a concrete slab over a lot of the old gravel, so there's room for a garden shed for extra storage and a practical spot for large items and the bins.
              </p>
            </div>
            <BudgetIndicator amount="$4,600" status="amber" className="mt-4 mb-10" />
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Fence", value: "Replaced, Monument Colorbond with sparse star jasmine on wires" },
              { label: "Garden bed", value: "Vege and fruit garden, edged in Monument, mulched, with stepping pavers through it" },
              { label: "Slab and path", value: "Light grey concrete, about 16 m², poured 3 to 4 Oct, runs flush to the house wall towards the street" },
              { label: "Storage", value: "Absco shed on the slab near the gate, plus space for bins and large items" },
              { label: "Lawn", value: "Small patches at the front left and front-right corner" },
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
              <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                <img src={ASSETS.before_kitchen} alt="Kitchen before" className="w-full h-72 md:h-[480px] object-cover transition-transform duration-700 hover:scale-[1.02]" />
              </div>
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Before</p>
            </FadeUp>
            <FadeUp delay={200}>
              <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                <img src={ASSETS.kitchen_locked} alt="Kitchen after — locked design" className="w-full h-72 md:h-[480px] object-cover transition-transform duration-700 hover:scale-[1.02]" />
              </div>
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>After — locked design</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <p className="text-base leading-relaxed max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              The kitchen sits right in the middle of the house, so space is tight. The goal was to get as much storage as possible without eating into a dining area that's already small. Instead of leaving the wall outside the kitchen blank, we've added a double bench along it. That gives extra bench and storage space without pushing further into the room. The sage green lower cabinets make the kitchen a feature spot that stands apart from the rest of the house. They still sit comfortably with the clean white uppers and light grey concrete-look benchtop, so nothing clashes. Glass-front uppers on the island side keep it feeling open. Removing the old doorway between kitchen and living makes the whole space flow as one open-plan area.
            </p>
            <BudgetIndicator amount="$17,500" status="green" className="mt-4 mb-10" />
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Lower Cabinets", value: "IKEA NICKEBO, matt grey-green" },
              { label: "Upper Cabinets (back)", value: "IKEA VOXTORP, matt white" },
              { label: "Upper Cabinets (island)", value: "IKEA HEJSTA, white frame / clear glass" },
              { label: "Benchtop", value: "IKEA EKBACKEN, light grey concrete effect. Still unpaid, IKEA stock expected mid to late Nov" },
              { label: "Splashback", value: "Still deciding between 2× IKEA LYSEKIL panels (paid $134.30, order 234859665, delivered 17 Nov) and white subway tile" },
              { label: "Sink", value: "IKEA KILSVIKEN, black quartz composite, 1 bowl" },
              { label: "Tap", value: "IKEA SALLSJÖN, black pull-out" },
              { label: "Oven", value: "IKEA SPJUTBO, pyrolytic, IKEA 300, black" },
              { label: "Cooktop", value: "IKEA KOLSTAN 500, induction, black, 58cm" },
              { label: "Rangehood", value: "IKEA UNDERVERK, built-in, stainless, 60cm" },
              { label: "Handles", value: "IKEA BAGGANÄS, black knobs, 21mm" },
              { label: "Lighting", value: "Two matte black dome pendants over the island, plus MITTLED LED strips under the uppers" },
              { label: "Doorway", value: "Existing doorway removed, fully open to living" },
              { label: "IKEA Order", value: "$11,666.44 paid (234146073, incl. delivery). Delivered 17 Nov, cabinets being assembled in the garage" },
              { label: "Install", value: "Self-installed by Jeremy, Zac and John. Demo and install dates not booked yet" },
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
              <ImageSlider slides={LAUNDRY_BEFORE_SLIDES} label="Before" frameClassName="h-72 md:h-[420px] w-full" />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Before</p>
            </FadeUp>
            <FadeUp delay={200}>
              <ImageSlider slides={LAUNDRY_AFTER_SLIDES} label="After — locked design" frameClassName="h-72 md:h-[420px] w-full" />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>After — locked design</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <p className="text-base leading-relaxed max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              The laundry is part of the same IKEA order as the kitchen, with white shaker cabinets and the same concrete-look benchtop. The big idea is to work with the space we already have but give it far more purposeful storage and a proper bench. That means tall storage, upper cabinets beside a wall-mounted dryer, the washer tucked under the bench and an inset sink. New flooring goes down too, so this stops being a pass-through and becomes a genuine mud room and laundry by the back door.
            </p>
            <BudgetIndicator amount="$3,000" status="green" className="mt-4 mb-10" />
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Cabinets", value: "White shaker" },
              { label: "Benchtop", value: "Grey concrete-look laminate, same as the kitchen" },
              { label: "Splashback", value: "White subway tile" },
              { label: "Floor", value: "Oak flooring to match the rest of the house" },
              { label: "Dryer", value: "Wall-mounted above bench" },
              { label: "Washing Machine", value: "Under-bench, front-load" },
              { label: "Lighting", value: "Recessed downlights" },
              { label: "Budget", value: "$3,000: covers flooring, tiles, plumbing and electrical" },
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
              <BudgetIndicator amount="$3,000" status="green" className="mt-4" />
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
              { label: "Budget", value: "$3,000: mainly carpet and small upgrades, keeping changes light" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 08 — Master Bedroom */}
      <section id="master" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="08 — Master Bedroom" title="Master Bedroom" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <FadeUp delay={100} className="space-y-6">
              <div>
                <ImageSlider
                  slides={[{ src: ASSETS.before_master, alt: "Master bedroom before" }]}
                  label="Before"
                  frameClassName="h-72 md:h-[480px] w-full"
                />
                <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Before</p>
              </div>
              <div>
                <ImageSlider
                  slides={[{ src: ASSETS.master_wardrobe_before, alt: "Walk-in wardrobe before" }]}
                  label="Before"
                  frameClassName="h-72 md:h-[480px] w-full"
                />
                <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Before</p>
              </div>
            </FadeUp>
            <FadeUp delay={200} className="space-y-6">
              <div>
                <ImageSlider
                  slides={[{ src: ASSETS.master_bedroom, alt: "Master bedroom after" }]}
                  label="After"
                  frameClassName="h-72 md:h-[480px] w-full"
                />
                <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>After</p>
              </div>
              <div>
                <ImageSlider
                  slides={[{ src: ASSETS.master_walkin_after, alt: "Walk-in wardrobe after" }]}
                  label="After"
                  frameClassName="h-72 md:h-[480px] w-full"
                />
                <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>After</p>
              </div>
            </FadeUp>
          </div>
          <FadeUp delay={100} className="mb-12">
            <p className="text-base leading-relaxed max-w-3xl" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
              The master bedroom is resolved through furniture quality rather than wall treatments. A tall fluted upholstered bedhead in oatmeal linen becomes the visual anchor — sculptural and premium without any paint or wallpaper treatment. The palette flows directly from the lounge: warm mid-grey carpet, oak bedside tables, matte black fan and hardware.
            </p>
            <BudgetIndicator amount="$4,000" status="green" className="mt-4" />
          </FadeUp>
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
              { label: "Budget", value: "$4,000: mainly the new walk-in wardrobe fit-out" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 09 — Bedrooms 2 & 3 */}
      <section id="bedrooms" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="09 — Secondary Bedrooms" title="Bedrooms 2 & 3" status="locked" />
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
                <p className="text-base leading-relaxed mt-4" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                  Bedroom 3 doesn't exist yet. It's being created as part of the renovation and will match Bedroom 2 exactly. Both rooms are about 3 x 3 m, but Bedroom 3 gives up a 1 x 1 m corner. That space becomes a new entry for Bedroom 2, because its current door is being filled in to make room for Bedroom 3.
                </p>
                <BudgetIndicator amount="$5,000" status="green" className="mt-4" />
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
              { label: "Budget", value: "$5,000: new walls to build Bedroom 3, electrical, and new built-in wardrobes in both rooms" },
            ]} />
          </FadeUp>
        </div>
      </section>

      {/* 10 — Bedroom 4 / Office */}
      <section id="bedroom-4" className="py-20 border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
        <div className="container">
          <SectionHeader label="10 — Bedroom 4 / Office" title="Bedroom 4 / Office" status="locked" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <FadeUp delay={100}>
              <ImageSlider slides={OFFICE_BEFORE_SLIDES} label="Before" />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>Before</p>
            </FadeUp>
            <FadeUp delay={200}>
              <ImageSlider slides={OFFICE_AFTER_SLIDES} label="After, locked design" />
              <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>After, locked design</p>
            </FadeUp>
          </div>
          <FadeUp delay={100}>
            <div className="max-w-3xl space-y-4">
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                Bedroom 4 becomes a proper home office, a moody wood and forest green space built for long days of deep work. The walls, ceiling and trim are all Taubmans Magic Forest, so the room wraps around you. The old open robe becomes a recessed built-in with walnut shelves, a slat panel, a brass hanging rail and green drawers. The wall behind the desk is the video-call backdrop, with walnut slat panels and brass sconces either side of three floating shelves. Warm mid-grey carpet matches the master bedroom, and a matt black fan finishes it off.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}>
                We're deliberately making this a highly custom room, which makes it slightly less suited to renting or investment. The wardrobe is built so it can still work as a normal bedroom wardrobe, though. It would just need doors added later and probably a repaint.
              </p>
            </div>
            <BudgetIndicator amount="$8,000" status="green" className="mt-4 mb-10" />
          </FadeUp>
          <FadeUp delay={300}>
            <SpecTable items={[
              { label: "Walls and ceiling", value: "Taubmans Magic Forest satin" },
              { label: "Wardrobe", value: "Recessed built-in, walnut and Magic Forest, brass hardware" },
              { label: "Feature wall", value: "Walnut slat panels with brass sconces and floating shelves" },
              { label: "Carpet", value: "Warm mid-grey, same as master bedroom" },
              { label: "Fan", value: "Matt black" },
              { label: "Budget", value: "$8,000: covers the custom built-in wardrobe, slat panels and shelving" },
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
                The renovation runs as a series of smaller projects, one flowing into the next, rather than one big build. We live in the house and run a business from home the whole way through, so the order is deliberate. Outdoor work comes first, then the kitchen and laundry, then the rooms one by one, and the bathrooms last. Demo is done in-house, and trades come in only for specialist work.
              </p>
            </div>
          </FadeUp>

          {[
            {
              num: "01",
              title: "Pool area",
              timing: "Crazy pave next",
              body: "Coping, slab, fence and landscaping are done, and the bench is nearly finished. Next is the Nimbus crazy pave, which starts around December and gets worked through slowly into the new year."
            },
            {
              num: "02",
              title: "Side access",
              timing: "Largely done",
              body: "This is largely done: the slab is poured and the shed is up and anchored. The last bits wait until after the bathrooms, because that work needs the access."
            },
            {
              num: "03",
              title: "Kitchen",
              timing: "Before Christmas",
              body: "The IKEA kitchen arrived on 17 Nov. The cabinets are built in the garage, then the old kitchen comes out and the new one goes in before Christmas."
            },
            {
              num: "04",
              title: "Laundry",
              timing: "Before Christmas",
              body: "This happens at the same time as the kitchen, before Christmas, with an oak floor and white subway tile splashback."
            },
            {
              num: "05",
              title: "Entrance",
              timing: "Anytime",
              body: "A quick, low-cost refresh that can happen whenever there's a gap."
            },
            {
              num: "06",
              title: "Bedroom 4 and plastering",
              timing: "After the kitchen",
              body: "The new wall and doorway go in, then the plasterer sheets and sets them and touches up ceilings through the house."
            },
            {
              num: "07",
              title: "Lounge and bedrooms",
              timing: "Room by room",
              body: "These are done room by room: repairs, Natural White paint, new architraves and black fans. Carpet goes in, with oak flooring laid at the end."
            },
            {
              num: "08",
              title: "Bathrooms",
              timing: "Later stage",
              body: "ShawCon builds both bathrooms in the later stage, with temporary facilities while that's happening. The side access gets finished after this."
            },
            {
              num: "09",
              title: "Exterior",
              timing: "Ongoing",
              body: "This runs alongside everything else: the Monument roof paint, gutters with our plumber, and the front garden."
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
              Each row matches a section above and uses its budget. Estimates include supply and labour where applicable. DIY labour is not costed. Pool coping is a confirmed quote. All other figures are allowances.
            </p>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="border-t" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "oklch(0.88 0.012 75)" }}>
                    <th className="py-3 text-left pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Section</th>
                    <th className="py-3 text-left pr-4" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Scope</th>
                    <th className="py-3 text-left pr-4 hidden md:table-cell" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Approach</th>
                    <th className="py-3 text-right" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { phase: "Street Presence", scope: "Retaining wall done, Monument roof paint, charcoal trim, front lawn and planting", approach: "Trade + DIY", estimate: "$20,000", confirmed: false },
                    { phase: "Entrance", scope: "Crazy pave over old tiles, awning off, paint, lighting, pots", approach: "DIY", estimate: "$1,500", confirmed: false },
                    { phase: "Pool & Outdoor Living", scope: "Coping (done), slab, bench, crazy pave, fence, landscaping", approach: "Trade + DIY", estimate: "$35,000", confirmed: true },
                    { phase: "Back Covered Patio", scope: "Paint, lighting and clean up", approach: "DIY", estimate: "$1,500", confirmed: false },
                    { phase: "Back Yard Area", scope: "Lawn, jasmine fence, path to side access", approach: "DIY", estimate: "$3,000", confirmed: false },
                    { phase: "Side Passage", scope: "Slab poured, shed anchored, finished after the bathrooms", approach: "DIY + Trade (slab)", estimate: "$4,600", confirmed: false },
                    { phase: "Kitchen", scope: "IKEA kitchen (paid), install, electrical, plumbing", approach: "Trade + DIY", estimate: "$17,500", confirmed: false },
                    { phase: "Laundry", scope: "Oak floor, subway tile, plumbing, electrical", approach: "Trade + DIY", estimate: "$3,000", confirmed: false },
                    { phase: "Bathrooms", scope: "Full build of both bathrooms", approach: "Builder + Plumber", estimate: "$60,000", confirmed: false },
                    { phase: "Living Room", scope: "Carpet and small upgrades", approach: "DIY + Trade", estimate: "$3,000", confirmed: false },
                    { phase: "Master Bedroom", scope: "Walk-in wardrobe fit-out", approach: "DIY + Trade", estimate: "$4,000", confirmed: false },
                    { phase: "Bedrooms 2 & 3", scope: "New walls, electrical, built-in wardrobes", approach: "DIY + Trade", estimate: "$5,000", confirmed: false },
                    { phase: "Bedroom 4 / Office", scope: "Built-in wardrobe, slat panels, shelving", approach: "DIY + Trade", estimate: "$8,000", confirmed: false },
                    { phase: "General", scope: "Sheeting, setting and ceiling touch-ups through the whole house", approach: "Trade", estimate: "$5,000", confirmed: false },
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
                    <td className="py-4 text-right" style={{ color: "oklch(0.22 0.025 55)", fontFamily: "Fraunces, Georgia, serif", fontSize: "1rem", fontWeight: 400 }}>$171,100</td>
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
                    { scenario: "Renovation cost", value: "$171,100", basis: "Project budget", highlight: false },
                    { scenario: "Net uplift (low case)", value: "~-$56,100", basis: "Below cost on paper; real return is rental uplift + vacancy risk removal", highlight: false },
                    { scenario: "Net uplift (high case)", value: "~$63,900", basis: "$1.50M – $1.265M – $171.1K", highlight: false },
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
                The current 3-bed / 1-bath configuration was renting at $625/week and described as difficult to place. Post-renovation, the property becomes a 4-bed / 2-bath with pool, new kitchen, and modern finishes — a genuinely different product in the rental market. At $800/week, the renovation pays back in rental income alone in approximately 18 years, but the real return is the combination of rental uplift, capital growth, and the removal of vacancy risk.
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
