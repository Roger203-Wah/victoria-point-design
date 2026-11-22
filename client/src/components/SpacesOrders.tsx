import React from "react";
import { SPACES_ORDERS, type SpaceRow } from "@/data/spacesOrders.generated";

// Spaces & Orders. All figures come from spacesOrders.generated.ts, which is built
// from the OneDrive workbook by scripts/build-spaces-orders.py. Nothing is typed in here.

const INK = "oklch(0.22 0.025 55)";
const BODY = "oklch(0.38 0.02 60)";
const MUTED = "oklch(0.52 0.02 60)";
const RULE = "oklch(0.88 0.012 75)";
const SANS = "Plus Jakarta Sans, sans-serif";
const SERIF = "Fraunces, Georgia, serif";

const m2 = (n: number | null) => (n == null ? "TBC" : `${n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`);
const num = (n: number) => n.toLocaleString("en-AU", { maximumFractionDigits: 2 });
const money = (n: number) => "$" + n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const size = (r: SpaceRow) => (r.length != null && r.width != null ? `${num(r.length)} × ${num(r.width)} m` : "TBC");

function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "amber" | "sage" }) {
  const tones = {
    neutral: { background: "oklch(0.93 0.02 75)", color: "oklch(0.45 0.03 60)" },
    amber: { background: "oklch(0.93 0.05 80)", color: "oklch(0.42 0.07 70)" },
    sage: { background: "oklch(0.92 0.04 155)", color: "oklch(0.3 0.07 155)" },
  }[tone];
  return (
    <span style={{ ...tones, fontFamily: SANS, fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 100, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function statusTone(status: string | null): "neutral" | "amber" | "sage" {
  const s = (status ?? "").toLowerCase();
  if (s.startsWith("paid") || s.startsWith("delivered")) return "sage";
  if (s.startsWith("accepted") || s.startsWith("ordered") || s.startsWith("quoted")) return "amber";
  return "neutral";
}

function SummaryCard({ title, sub, floor, order, orderNote }: { title: string; sub: string; floor: number | null; order: number | null; orderNote: string }) {
  return (
    <div className="p-6" style={{ border: `1px solid ${RULE}`, background: "oklch(0.985 0.005 75)" }}>
      <span className="section-label mb-3 block">{title}</span>
      <p style={{ fontFamily: SANS, fontWeight: 300, color: BODY, fontSize: "0.9rem", marginBottom: "1.25rem" }}>{sub}</p>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div style={{ fontFamily: SERIF, fontSize: "2.4rem", lineHeight: 1, color: INK }}>{m2(floor)}</div>
          <div style={{ fontFamily: SANS, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED, marginTop: 6 }}>Floor area</div>
        </div>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: order == null ? "1.15rem" : "2.4rem", lineHeight: order == null ? 1.3 : 1, color: INK, minHeight: "2.4rem" }}>
            {order == null ? orderNote : m2(order)}
          </div>
          <div style={{ fontFamily: SANS, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED, marginTop: 6 }}>
            {order == null ? "To order" : orderNote}
          </div>
        </div>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { fontFamily: SANS, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, textAlign: "left", padding: "10px 12px 10px 0", borderBottom: `1px solid ${RULE}` };
const td: React.CSSProperties = { fontFamily: SANS, fontWeight: 300, fontSize: "0.9rem", color: INK, padding: "10px 12px 10px 0", borderBottom: `1px solid ${RULE}`, verticalAlign: "top" };

export function SpacesOrdersBody() {
  const { rooms, totals, orders } = SPACES_ORDERS;
  const groups: { key: "hybrid" | "carpet"; label: string }[] = [
    { key: "hybrid", label: "Hybrid" },
    { key: "carpet", label: "Carpet" },
  ];
  const hybridOrder = orders.find((o) => (o.code ?? "").includes("Taroona"));
  const toMeasure = [
    ...rooms.filter((r) => r.type === "tiles" && r.room && r.area == null).map((r) => ({ name: r.room as string, why: "Tiles. Needs a measure." })),
    ...rooms.filter((r) => r.rough).map((r) => ({ name: (r.room as string).replace(/ \(open floor\)/, ""), why: "Hybrid. Rough measure, needs a proper one." })),
  ];

  return (
    <>
      {/* 1. Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-14">
        <SummaryCard title="Hybrid" sub="Carpet Court Affluent Hybrid Taroona 7.5" floor={totals.hybrid.area} order={totals.hybrid.orderArea} orderNote="to order at 10% waste" />
        <SummaryCard title="Carpet" sub="Warm mid-grey" floor={totals.carpet.area} order={totals.carpet.orderArea} orderNote="Order qty after Carpet Court measure" />
      </div>

      {/* 2. Room by room */}
      <h3 className="text-3xl mb-4" style={{ fontFamily: SERIF, color: INK }}>Room by room</h3>
      <div className="overflow-x-auto mb-14">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr>
              <th style={th}>Room</th>
              <th style={th}>Floor type</th>
              <th style={th}>Size (L × W)</th>
              <th style={{ ...th, textAlign: "right", paddingRight: 0 }}>m²</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <React.Fragment key={g.key}>
                {rooms.filter((r) => r.type === g.key && r.room).map((r) => (
                  <tr key={r.room!}>
                    <td style={td}>
                      {r.room}
                      {r.rough && <> <Tag tone="amber">rough</Tag></>}
                      {r.notes && !/TBC/.test(r.notes) && <div style={{ fontSize: "0.78rem", color: MUTED, marginTop: 2 }}>{r.notes}</div>}
                    </td>
                    <td style={td}>{g.label}</td>
                    <td style={td}>{size(r)}</td>
                    <td style={{ ...td, textAlign: "right", paddingRight: 0 }}>{m2(r.area)}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ ...td, fontWeight: 600 }} colSpan={3}>{g.label} total floor area</td>
                  <td style={{ ...td, fontWeight: 600, textAlign: "right", paddingRight: 0 }}>{m2(totals[g.key].area)}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Product orders */}
      <h3 className="text-3xl mb-4" style={{ fontFamily: SERIF, color: INK }}>Product orders</h3>
      <div className="overflow-x-auto mb-14">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead>
            <tr>
              <th style={th}>Item</th>
              <th style={th}>Supplier</th>
              <th style={th}>Rooms</th>
              <th style={th}>Qty</th>
              <th style={th}>Price</th>
              <th style={{ ...th, paddingRight: 0 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const [head, ...rest] = (o.status ?? "").split(",");
              return (
                <tr key={o.item}>
                  <td style={td}>
                    {o.item}
                    {o.code && <div style={{ fontSize: "0.78rem", color: MUTED, marginTop: 2 }}>{o.code}</div>}
                    {o.ref && <div style={{ fontSize: "0.78rem", color: MUTED }}>{o.ref}</div>}
                  </td>
                  <td style={td}>{o.supplier ?? "TBC"}</td>
                  <td style={td}>{o.rooms ?? "TBC"}</td>
                  <td style={td}>{o.qty == null ? "TBC" : `${num(o.qty)} ${o.unit ?? ""}`}</td>
                  <td style={td}>
                    {o.total != null ? <>{money(o.total)}<div style={{ fontSize: "0.78rem", color: MUTED }}>inc GST</div></> : "Price TBC"}
                  </td>
                  <td style={{ ...td, paddingRight: 0 }}>
                    <Tag tone={statusTone(o.status)}>{head || "TBC"}</Tag>
                    {rest.length > 0 && <div style={{ fontSize: "0.78rem", color: MUTED, marginTop: 4 }}>{rest.join(",").trim()}</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {hybridOrder && hybridOrder.qty != null && (
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "0.8rem", color: MUTED, marginTop: 8 }}>
            Taroona quantity is the hybrid floor area plus a 10% waste allowance, which is an assumption until the supplier confirms pack sizes.
          </p>
        )}
      </div>

      {/* 4. Still to measure */}
      <h3 className="text-3xl mb-4" style={{ fontFamily: SERIF, color: INK }}>Still to measure</h3>
      <ul className="max-w-xl">
        {toMeasure.map((m) => (
          <li key={m.name} className="flex items-baseline justify-between gap-4 py-3" style={{ borderBottom: `1px solid ${RULE}`, fontFamily: SANS, color: INK, fontWeight: 300 }}>
            <span>{m.name}</span>
            <span style={{ color: MUTED, fontSize: "0.82rem", textAlign: "right" }}>{m.why}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
