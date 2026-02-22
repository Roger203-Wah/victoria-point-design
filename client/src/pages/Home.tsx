/*
  DESIGN PHILOSOPHY: Warm Minimal Studio
  - Warm linen bg (#F2EDE6 equiv) / deep warm brown headings / sage green accents
  - Fraunces display serif + Plus Jakarta Sans body
  - Horizontal wide sections, editorial image-text blocks
  - Scroll-triggered fade-in animations
  - Feels like a printed design document brought to screen
*/

import { useEffect, useRef } from "react";

// CDN URLs for all render assets
const ASSETS = {
  front_facade: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/zurpoWLKDZrdLGaC.png",
  side_access: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/aQdNUFVvfBpRTbCV.png",
  lounge: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/lNPjrvQARSSiQBHY.png",
  master_bedroom: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/axjSIlhcABFTdSKs.png",
  bedroom2: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/mUlMLfRYAULNIbem.png",
  kitchen_pendants: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/hQnThuiKjtYaoTsx.png",
  kitchen_clean: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/zdmtasgohuGKZLNP.png",
  hallway: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/dNJnCGkJgobNOmOl.png",
  pool: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/xbVRlKPGbsRmQooC.png",
  ensuite: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/wWOsFQGOfhVmCPuB.jpg",
  main_bathroom: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663362896871/uYrGWRYlUIfNOzdz.jpg",
};

// Colour palette data
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

// Space data
const SPACES = [
  {
    id: "exterior",
    label: "01 — Exterior",
    title: "Street Presence",
    status: "locked",
    image: ASSETS.front_facade,
    imageAlt: "Front facade transformation render",
    summary: "The existing red brick is retained as the hero material — warm, textural, and distinctive. Everything around it is resolved in a unified charcoal palette: Colorbond Ironstone roof, charcoal panel-lift garage door, charcoal rendered retaining wall, and charcoal fascia and window frames. The result is a deliberate, contemporary facade that photographs exceptionally well for rental listings.",
    items: [
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
    ],
  },
  {
    id: "side-access",
    label: "02 — Side Access",
    title: "Side Passage",
    status: "locked",
    image: ASSETS.side_access,
    imageAlt: "Side access passage render",
    summary: "The side passage connects the street to the pool area and is designed as a cohesive extension of the backyard palette. Dark charcoal Colorbond fence, tropical low-maintenance planting in dark mulch, and warm solar stake path lights create a designed corridor rather than a forgotten utility passage.",
    items: [
      { label: "Fence", value: "Charcoal Colorbond — matches pool area" },
      { label: "Garden Bed", value: "Dark mulch, bromeliads, cordylines, clumping grasses" },
      { label: "Edging", value: "River rock border along garden bed" },
      { label: "Path Lighting", value: "Solar stake lights — warm amber, full length" },
      { label: "Shed", value: "Slimline charcoal shed at far end" },
      { label: "Path", value: "Existing concrete retained and cleaned" },
    ],
  },
  {
    id: "lounge",
    label: "03 — Lounge",
    title: "Living Room",
    status: "locked",
    image: ASSETS.lounge,
    imageAlt: "Lounge transformation render",
    summary: "The lounge anchors the interior palette. White painted brick feature wall adds texture without colour, the floating oak TV unit grounds the space, and the warm mid-grey carpet flows through to all bedrooms. The matte black DC ceiling fan and recessed downlights replace the dated fitting. No feature wall paint — the design relies on material quality and furniture to create character.",
    items: [
      { label: "Walls", value: "Dulux Natural White throughout" },
      { label: "Brick Wall", value: "Painted white — texture retained, colour unified" },
      { label: "Carpet", value: "Warm mid-grey — Feltex or Godfrey Hirst" },
      { label: "TV Unit", value: "Floating oak timber with matte black legs" },
      { label: "Ceiling Fan", value: "Matte black DC fan — no light fitting" },
      { label: "Lighting", value: "Recessed downlights — warm white 2700K" },
      { label: "Curtains", value: "Sheer linen + blockout roller blind" },
      { label: "Coffee Table", value: "Matte black frame, stone or glass top" },
    ],
  },
  {
    id: "kitchen",
    label: "04 — Kitchen",
    title: "Kitchen",
    status: "locked",
    image: ASSETS.kitchen_pendants,
    imageAlt: "Kitchen transformation render with pendant lights",
    imageAlt2: "Kitchen transformation render — downlights only",
    image2: ASSETS.kitchen_clean,
    summary: "A full IKEA METOD kitchen in NICKEBO matt grey-green lower cabinets with VOXTORP matt white uppers and HEJSTA white/clear glass uppers on the peninsula side. The EKBACKEN light grey concrete effect benchtop and KILSVIKEN black quartz composite sink are the key material moments. The existing doorway between kitchen and living is removed to create a fully open-plan flow. Two pendant options are presented.",
    items: [
      { label: "Lower Cabinets", value: "IKEA NICKEBO — matt grey-green" },
      { label: "Upper Cabinets (back)", value: "IKEA VOXTORP — matt white" },
      { label: "Upper Cabinets (island side)", value: "IKEA HEJSTA — white frame / clear glass" },
      { label: "Benchtop", value: "IKEA EKBACKEN — light grey concrete effect laminate" },
      { label: "Splashback", value: "Light grey vertical subway tile, mid-grey grout" },
      { label: "Sink", value: "IKEA KILSVIKEN — black quartz composite, 1 bowl" },
      { label: "Tap", value: "IKEA DELSJÖN — brushed black metal mixer" },
      { label: "Oven", value: "IKEA BRÄNDBO 500 — forced air, black" },
      { label: "Cooktop", value: "IKEA KOLSTAN 500 — induction, black, 58cm" },
      { label: "Rangehood", value: "IKEA UNDERVERK — built-in, stainless, 60cm" },
      { label: "Handles", value: "IKEA BAGGANÄS — black knobs, 21mm" },
      { label: "Lighting", value: "MITTLED LED strips under uppers + pendant option" },
      { label: "Pendants", value: "Option A: 2× matte black dome pendants over island" },
      { label: "Doorway", value: "Existing doorway removed — fully open to living" },
      { label: "IKEA Total", value: "$13,315.97 (self-collect, excl. delivery & install)" },
    ],
  },
  {
    id: "master",
    label: "05 — Master Bedroom",
    title: "Master Bedroom",
    status: "locked",
    image: ASSETS.master_bedroom,
    imageAlt: "Master bedroom transformation render",
    summary: "The master bedroom is resolved through furniture quality rather than wall treatments. A tall fluted upholstered bedhead in oatmeal linen becomes the visual anchor — sculptural and premium without any paint or wallpaper treatment. The palette flows directly from the lounge: warm mid-grey carpet, oak bedside tables, matte black fan and hardware.",
    items: [
      { label: "Walls", value: "Dulux Natural White — no feature wall" },
      { label: "Bedhead", value: "Tall fluted upholstered — oatmeal linen fabric" },
      { label: "Carpet", value: "Warm mid-grey — continuous from lounge" },
      { label: "Bedside Tables", value: "Oak timber with matte black legs" },
      { label: "Bedside Lighting", value: "Matte black wall-mounted sconces" },
      { label: "Ceiling Fan", value: "Matte black DC fan — no light fitting" },
      { label: "Lighting", value: "Recessed downlights — warm white 2700K" },
      { label: "Window Treatment", value: "Blockout roller blind + sheer linen curtain" },
      { label: "Dresser", value: "Oak timber with matte black handles and mirror above" },
    ],
  },
  {
    id: "bedrooms",
    label: "06 — Bedrooms 2 & 3",
    title: "Secondary Bedrooms",
    status: "locked",
    image: ASSETS.bedroom2,
    imageAlt: "Secondary bedroom transformation render",
    summary: "Bedrooms 2 and 3 share the same layout and the same design approach — cohesive with the master bedroom but self-contained. The oatmeal linen bedhead and warm mid-grey carpet create a calm, restful palette. White sliding robe doors with matte black handles span the full right wall. The design is deliberately quiet — these rooms should feel like a considered hotel rather than a rental.",
    items: [
      { label: "Walls", value: "Dulux Natural White" },
      { label: "Bedhead", value: "Upholstered — oatmeal linen, queen size" },
      { label: "Carpet", value: "Warm mid-grey — same as master and lounge" },
      { label: "Built-in Robe", value: "Full-wall sliding doors — white with matte black handles" },
      { label: "Bedside Tables", value: "Oak timber, compact" },
      { label: "Ceiling Fan", value: "Matte black DC fan" },
      { label: "Lighting", value: "Recessed downlights — warm white 2700K" },
      { label: "Window Treatment", value: "Blockout roller blind + sheer linen curtain" },
    ],
  },
  {
    id: "bathrooms",
    label: "07 — Bathrooms",
    title: "Ensuite & Main Bathroom",
    status: "locked",
    image: ASSETS.ensuite,
    imageAlt: "Ensuite render",
    image2: ASSETS.main_bathroom,
    imageAlt2: "Main bathroom render",
    summary: "Both bathrooms are being fully renovated within a combined PC (Prime Cost) allowance. The design language is consistent: large format tiles, matte black tapware and fittings, frameless shower screens, and floating vanities. The ensuite connects directly through the walk-in wardrobe from the master bedroom, creating a genuine suite sequence.",
    items: [
      { label: "Tiles", value: "Large format — warm white / light grey" },
      { label: "Tapware", value: "Matte black throughout" },
      { label: "Shower Screen", value: "Frameless glass — matte black frame" },
      { label: "Vanity", value: "Floating — white with matte black handles" },
      { label: "Basin", value: "Under-mount white ceramic" },
      { label: "Toilet", value: "Wall-hung or close-coupled — white" },
      { label: "Mirror", value: "Frameless or matte black framed" },
      { label: "Lighting", value: "Recessed downlights + mirror light" },
      { label: "Towel Rail", value: "Matte black heated towel rail" },
    ],
  },
  {
    id: "hallway",
    label: "08 — Hallway & Floors",
    title: "Hallway & Flooring",
    status: "locked",
    image: ASSETS.hallway,
    imageAlt: "Hallway floor transformation render",
    summary: "The existing honey-orange timber vinyl is replaced throughout the kitchen, hallway, and dining area with a natural European oak LVP — cooler, lighter, and more contemporary. The pale natural oak bridges the warm mid-grey carpet at every bedroom threshold without clashing, and the subtle timber grain reads as genuine rather than synthetic.",
    items: [
      { label: "Product", value: "Karndean Van Gogh 'Classic Oak' or equivalent" },
      { label: "Alternatives", value: "Hybrid Flooring 'French Oak' / Quick-Step 'Natural Oak'" },
      { label: "Finish", value: "Matte — no gloss" },
      { label: "Tone", value: "Pale natural oak — no orange or yellow cast" },
      { label: "Areas", value: "Kitchen, hallway, dining, entry" },
      { label: "Transition", value: "Carpet to LVP at all bedroom doorways" },
    ],
  },
  {
    id: "pool",
    label: "09 — Pool & Outdoor",
    title: "Pool & Outdoor Living",
    status: "locked",
    image: ASSETS.pool,
    imageAlt: "Pool area transformation render",
    summary: "The pool area establishes the outdoor design language that flows through the side access and to the street. Dark composite decking, charcoal Colorbond fencing, tropical low-maintenance planting in dark mulch, and warm festoon lighting create a resort-style outdoor living space. The charcoal palette ties directly to the exterior facade.",
    items: [
      { label: "Decking", value: "Dark composite — Trex or equivalent" },
      { label: "Fence", value: "Charcoal Colorbond — pool compliant" },
      { label: "Pool Fence", value: "Frameless glass with matte black hardware" },
      { label: "Planting", value: "Bromeliads, cordylines, clumping grasses — dark mulch" },
      { label: "Lighting", value: "Warm festoon lights + garden stake lights" },
      { label: "Outdoor Furniture", value: "Dark frame with neutral cushions" },
    ],
  },
];

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

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
      { threshold: 0.08 }
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

function SpaceSection({ space, index }: { space: typeof SPACES[0]; index: number }) {
  const isEven = index % 2 === 0;
  const hasTwoImages = !!(space.image2);

  return (
    <section
      id={space.id}
      className="py-20 border-t border-border"
      style={{ borderColor: "oklch(0.88 0.012 75)" }}
    >
      <div className="container">
        <FadeUp>
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="section-label mb-3 block">{space.label}</span>
              <h2
                className="text-5xl md:text-6xl leading-none"
                style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)" }}
              >
                {space.title}
              </h2>
            </div>
            <span className={space.status === "locked" ? "status-locked" : "status-pending"}>
              {space.status === "locked" ? "Locked In" : "Pending"}
            </span>
          </div>
        </FadeUp>

        {hasTwoImages ? (
          /* Two-image layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <FadeUp delay={100}>
              <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                <img
                  src={space.image}
                  alt={space.imageAlt}
                  className="w-full h-72 md:h-96 object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
                {space.id === "kitchen" && (
                  <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>
                    Option A — With pendant lights
                  </p>
                )}
                {space.id === "bathrooms" && (
                  <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>
                    Ensuite
                  </p>
                )}
              </div>
            </FadeUp>
            <FadeUp delay={200}>
              <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                <img
                  src={space.image2}
                  alt={space.imageAlt2}
                  className="w-full h-72 md:h-96 object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
                {space.id === "kitchen" && (
                  <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>
                    Option B — Downlights only
                  </p>
                )}
                {space.id === "bathrooms" && (
                  <p className="text-xs mt-2" style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "0.05em" }}>
                    Main Bathroom
                  </p>
                )}
              </div>
            </FadeUp>
          </div>
        ) : (
          /* Single image layout — alternating left/right */
          <div className={`grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12 items-start ${isEven ? "" : "lg:[direction:rtl]"}`}>
            <FadeUp delay={100} className="lg:col-span-3">
              <div className={isEven ? "" : "[direction:ltr]"}>
                <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                  <img
                    src={space.image}
                    alt={space.imageAlt}
                    className="w-full h-72 md:h-[480px] object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={200} className="lg:col-span-2">
              <div className={isEven ? "" : "[direction:ltr]"}>
                <p
                  className="text-base leading-relaxed mb-8"
                  style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}
                >
                  {space.summary}
                </p>
              </div>
            </FadeUp>
          </div>
        )}

        {/* Summary text for two-image layouts */}
        {hasTwoImages && (
          <FadeUp delay={100}>
            <p
              className="text-base leading-relaxed mb-10 max-w-3xl"
              style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}
            >
              {space.summary}
            </p>
          </FadeUp>
        )}

        {/* Specification table */}
        <FadeUp delay={300}>
          <div
            className="border-t"
            style={{ borderColor: "oklch(0.88 0.012 75)" }}
          >
            <table className="w-full text-sm">
              <tbody>
                {space.items.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b"
                    style={{ borderColor: "oklch(0.92 0.008 75)" }}
                  >
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
                    <td
                      className="py-3"
                      style={{ color: "oklch(0.28 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}
                    >
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export default function Home() {
  const navSections = SPACES.map((s) => ({ id: s.id, label: s.title }));
  const [activeSection, setActiveSection] = React.useState<string>("exterior");

  useEffect(() => {
    const handleScroll = () => {
      const sections = SPACES.map((s) => document.getElementById(s.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(SPACES[i].id);
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
      <nav
        className="sticky top-0 z-50 border-b hidden lg:block"
        style={{
          background: "oklch(0.965 0.008 75 / 0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "oklch(0.88 0.012 75)",
        }}
      >
        <div className="container flex items-center justify-between h-14">
          <span
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "0.95rem",
              color: "oklch(0.22 0.025 55)",
              fontWeight: 400,
            }}
          >
            14 Prescoter Drive
          </span>
          <div className="flex items-center gap-6">
            {navSections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-xs transition-colors duration-200"
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: activeSection === s.id ? 600 : 400,
                  letterSpacing: "0.06em",
                  color: activeSection === s.id ? "oklch(0.48 0.06 155)" : "oklch(0.52 0.02 60)",
                  paddingBottom: "2px",
                  background: "none",
                  border: "none",
                  borderBottom: activeSection === s.id ? "1.5px solid oklch(0.48 0.06 155)" : "1.5px solid transparent",
                  cursor: "pointer",
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
        <img
          src={ASSETS.front_facade}
          alt="14 Prescoter Drive — front facade"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.55)" }}
        />
        <div className="relative z-10 container flex flex-col justify-end h-full" style={{ minHeight: "90vh", paddingBottom: "5rem" }}>
          <FadeUp>
            <span
              className="section-label mb-6"
              style={{ color: "oklch(0.85 0.02 75)" }}
            >
              <span style={{ background: "oklch(0.85 0.02 75)", width: "2rem", height: "1.5px", display: "inline-block", marginRight: "0.75rem", verticalAlign: "middle" }}></span>
              Renovation Design Presentation
            </span>
            <h1
              className="text-6xl md:text-8xl leading-none mb-6"
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                color: "oklch(0.97 0.005 75)",
                fontWeight: 300,
                maxWidth: "14ch",
              }}
            >
              14 Prescoter Drive
            </h1>
            <p
              className="text-lg max-w-xl"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                color: "oklch(0.82 0.01 75)",
                fontWeight: 300,
                lineHeight: 1.7,
              }}
            >
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
              <h2
                className="text-4xl leading-tight mb-6"
                style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)" }}
              >
                One cohesive palette. Every space resolved.
              </h2>
            </FadeUp>
            <FadeUp delay={150} className="lg:col-span-2">
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}
              >
                The renovation is designed as a single, unified project rather than a collection of individual room upgrades. Every space shares the same material vocabulary: natural oak timber, warm mid-grey carpet, matte black hardware, and Dulux Natural White walls. This consistency means the house photographs as a premium, considered property — not a patchwork of renovations completed at different times.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "oklch(0.38 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}
              >
                The design prioritises durability and rental performance without sacrificing quality. Every finish selection has been made with a long-term tenant in mind: LVP flooring over tiles, matte black hardware over chrome (which shows water marks), DC ceiling fans for energy efficiency, and low-maintenance tropical planting throughout the exterior.
              </p>
            </FadeUp>
          </div>

          {/* Stats row */}
          <FadeUp delay={200}>
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-16 border-t border-b"
              style={{ borderColor: "oklch(0.88 0.012 75)" }}
            >
              {[
                { num: "9", label: "Spaces Designed" },
                { num: "100%", label: "Spaces Locked In" },
                { num: "1", label: "Unified Palette" },
                { num: "QLD", label: "Victoria Point" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="py-8 px-6 border-r last:border-r-0"
                  style={{ borderColor: "oklch(0.88 0.012 75)" }}
                >
                  <div
                    className="text-4xl mb-1"
                    style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)", fontWeight: 300 }}
                  >
                    {stat.num}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}
                  >
                    {stat.label}
                  </div>
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
            <h2
              className="text-5xl leading-none mb-12"
              style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)" }}
            >
              The Palette
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PALETTE.map((swatch, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className="group">
                  <div
                    className="w-full h-24 mb-4 transition-transform duration-300 group-hover:scale-[1.02]"
                    style={{
                      background: swatch.hex,
                      borderRadius: "2px",
                      border: "1px solid oklch(0.85 0.01 75)",
                    }}
                  />
                  <div
                    className="text-sm font-medium mb-1"
                    style={{ color: "oklch(0.22 0.025 55)", fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {swatch.name}
                  </div>
                  <div
                    className="text-xs mb-2"
                    style={{ color: "oklch(0.48 0.06 155)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500 }}
                  >
                    {swatch.code}
                  </div>
                  <div
                    className="text-xs leading-relaxed"
                    style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}
                  >
                    {swatch.use}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Space sections */}
      {SPACES.map((space, i) => (
        <SpaceSection key={space.id} space={space} index={i} />
      ))}

      {/* Footer */}
      <footer
        className="py-16 border-t"
        style={{ borderColor: "oklch(0.88 0.012 75)" }}
      >
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div
              className="text-2xl mb-1"
              style={{ fontFamily: "Fraunces, Georgia, serif", color: "oklch(0.22 0.025 55)", fontWeight: 400 }}
            >
              14 Prescoter Drive
            </div>
            <div
              className="text-sm"
              style={{ color: "oklch(0.52 0.02 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}
            >
              Victoria Point, QLD — Renovation Design Presentation
            </div>
          </div>
          <div
            className="text-xs"
            style={{ color: "oklch(0.62 0.015 60)", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 300 }}
          >
            Prepared February 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

// Need React import for JSX
import React from "react";
