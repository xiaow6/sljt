import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { actions, useRun } from "../store";
import { MenuModal } from "./MenuModal";
import { useLang, t } from "../i18n";
import { RelicBar } from "./RelicBar";
import { DeckModal } from "./DeckModal";
import { getAct } from "../game/acts";
import type { MapNode } from "../game/types";

function nodeLabel(type: string): string {
  if (type === "battle") return t("node.battle");
  if (type === "elite") return t("node.elite");
  if (type === "rest") return t("node.rest");
  if (type === "shop") return t("node.shop");
  if (type === "boss") return t("node.boss");
  if (type === "event") return t("node.event");
  return type;
}

const TYPE_ICON: Record<string, string> = {
  battle: "⚔",
  elite: "★",
  rest: "🔧",
  shop: "💠",
  boss: "👁",
  event: "?",
};

export function MapScreen() {
  useLang();
  const run = useRun();
  const [showDeck, setShowDeck] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const act = getAct(run.act);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Scroll synchronously after layout. Entry on a new act → instant snap to
  // bottom (entry row). After each step → smooth scroll keeping current node
  // at ~65% down the visible area.
  useLayoutEffect(() => {
    if (!wrapRef.current) return;
    const wrap = wrapRef.current;
    const cur = run.map.find((n) => n.id === run.currentNodeId);
    if (!cur) {
      // Entry: snap (no smooth) so the user starts at the bottom immediately.
      wrap.scrollTop = wrap.scrollHeight;
      return;
    }
    const node = wrap.querySelector(
      `[data-node-id="${cur.id}"]`,
    ) as HTMLElement | null;
    if (!node) return;
    const wrapH = wrap.clientHeight;
    const targetTop = node.offsetTop - wrapH * 0.65;
    wrap.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, [run.act, run.currentNodeId, run.map]);

  const rows = Math.max(...run.map.map((n) => n.row), 0) + 1;
  const cols = Math.max(...run.map.map((n) => n.col), 0) + 1;

  const reachable = (n: MapNode) => {
    if (run.currentNodeId == null) return n.row === 0;
    const cur = run.map.find((m) => m.id === run.currentNodeId);
    return cur ? cur.next.includes(n.id) : false;
  };

  // Viewport-aware sizing — tighter constants on phones so all 6 columns fit.
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== "undefined" && window.innerWidth < 700,
  );
  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 700);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const NODE_W = isNarrow ? 44 : 64;
  const NODE_H = isNarrow ? 44 : 64;
  const COL_GAP = isNarrow ? 16 : 80;
  const ROW_GAP = isNarrow ? 60 : 96;
  const PAD_X = isNarrow ? 12 : 32;
  const PAD_Y = isNarrow ? 24 : 32;
  const mapWidth = cols * NODE_W + (cols - 1) * COL_GAP + PAD_X * 2;
  const mapHeight = rows * NODE_H + (rows - 1) * ROW_GAP + PAD_Y * 2;

  const nodeCenter = (n: MapNode) => ({
    x: PAD_X + n.col * (NODE_W + COL_GAP) + NODE_W / 2,
    y: PAD_Y + (rows - 1 - n.row) * (NODE_H + ROW_GAP) + NODE_H / 2,
  });

  return (
    <div
      className="map-screen"
      style={{
        backgroundImage: `url(/art/${act.scene})`,
      }}
    >
      <div className="map-header">
        <div>
          <div className="map-act-label">{act.name}</div>
          <h1>{t(`map.subtitle.act${act.id}`)}</h1>
        </div>
        <div className="map-stats">
          <span className="stat-pill">
            <span className="stat-icon">❤</span> {run.playerHp} / {run.playerMaxHp}
          </span>
          <span className="stat-pill">
            <span className="stat-icon chip-icon">◈</span> {run.gold}
          </span>
          <button className="stat-pill stat-clickable" onClick={() => setShowDeck(true)}>
            <span className="stat-icon">📜</span> {t("stat.deck")} {run.deck.length}
          </button>
          <button
            className="stat-pill stat-clickable map-menu-btn"
            onClick={() => setShowMenu(true)}
            title="菜单"
          >
            ☰
          </button>
        </div>
      </div>
      <RelicBar />

      <div className="map-graph-wrap" ref={wrapRef}>
        <div
          className="map-graph"
          style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}
        >
          <svg
            className="map-edges"
            width={mapWidth}
            height={mapHeight}
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          >
            {run.map.flatMap((n) =>
              n.next
                .map((nid) => run.map.find((m) => m.id === nid))
                .filter((m): m is MapNode => !!m)
                .map((m) => {
                  const a = nodeCenter(n);
                  const b = nodeCenter(m);
                  const traveled = n.visited && m.visited;
                  const cls = traveled ? "edge-done" : "edge";
                  return (
                    <line
                      key={`${n.id}-${m.id}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      className={cls}
                    />
                  );
                }),
            )}
          </svg>
          {run.map.map((n) => {
            const c = nodeCenter(n);
            const isCurrent = n.id === run.currentNodeId;
            const isReachable = reachable(n);
            const status = n.visited
              ? "node-done"
              : isCurrent
                ? "node-current"
                : isReachable
                  ? "node-reachable"
                  : "node-future";
            return (
              <button
                key={n.id}
                data-node-id={n.id}
                className={`map-node-btn node-${n.type} ${status}`}
                style={{
                  left: `${c.x - NODE_W / 2}px`,
                  top: `${c.y - NODE_H / 2}px`,
                  width: `${NODE_W}px`,
                  height: `${NODE_H}px`,
                }}
                disabled={!isReachable || n.visited}
                onClick={() => actions.enterNode(n.id)}
              >
                <div className="node-icon">{TYPE_ICON[n.type]}</div>
                <div className="node-label">{nodeLabel(n.type)}</div>
              </button>
            );
          })}
          {(() => {
            // Visible band = current row + next reachable row.
            // Before entry (currentNodeId null): only entry row visible.
            const cur = run.map.find((n) => n.id === run.currentNodeId);
            const currentRow = cur ? cur.row : -1;
            // Lower bound (past) — anything BELOW (higher y) the current row's
            // bottom edge gets shrouded as "behind you".
            const pastEdgeRow = currentRow >= 0 ? currentRow : 0;
            // Upper bound (future mystery) — anything ABOVE (lower y) the
            // peek-ahead row's top edge stays in shadow.
            const peekRow = currentRow + 1;

            const pastEdgeY =
              PAD_Y + (rows - 1 - pastEdgeRow) * (NODE_H + ROW_GAP) + NODE_H + 24;
            const peekTopY =
              PAD_Y + (rows - 1 - peekRow) * (NODE_H + ROW_GAP) - 24;

            return (
              <>
                {/* Top fog: hides far-future rows (toward the boss) */}
                <div
                  className="map-fog map-fog-top"
                  style={{
                    top: 0,
                    height: `${Math.max(0, peekTopY)}px`,
                  }}
                />
                {/* Bottom fog: hides walked-over rows (toward entry) */}
                {currentRow >= 0 && (
                  <div
                    className="map-fog map-fog-bottom"
                    style={{
                      top: `${pastEdgeY}px`,
                      height: `${Math.max(0, mapHeight - pastEdgeY)}px`,
                    }}
                  />
                )}
              </>
            );
          })()}
        </div>
      </div>

      {showDeck && <DeckModal onClose={() => setShowDeck(false)} />}
      {showMenu && <MenuModal onClose={() => setShowMenu(false)} />}
    </div>
  );
}
