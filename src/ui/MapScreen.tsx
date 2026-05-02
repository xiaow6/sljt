import { useEffect, useRef, useState } from "react";
import { actions, useRun } from "../store";
import { RelicBar } from "./RelicBar";
import { DeckModal } from "./DeckModal";
import { getAct } from "../game/acts";
import type { MapNode } from "../game/types";

const TYPE_LABEL: Record<string, string> = {
  battle: "战斗",
  elite: "精英",
  rest: "休整",
  shop: "商店",
  boss: "BOSS",
  event: "事件",
};

const TYPE_ICON: Record<string, string> = {
  battle: "⚔",
  elite: "★",
  rest: "🔧",
  shop: "💠",
  boss: "👁",
  event: "?",
};

export function MapScreen() {
  const run = useRun();
  const [showDeck, setShowDeck] = useState(false);
  const act = getAct(run.act);
  const wrapRef = useRef<HTMLDivElement>(null);

  // On act change, scroll to bottom (entry row).
  useEffect(() => {
    if (wrapRef.current) {
      // If a current node exists, center on it; else scroll to bottom.
      const cur = run.map.find((n) => n.id === run.currentNodeId);
      if (!cur) {
        wrapRef.current.scrollTop = wrapRef.current.scrollHeight;
      }
    }
  }, [run.act, run.currentNodeId, run.map]);

  const rows = Math.max(...run.map.map((n) => n.row), 0) + 1;
  const cols = Math.max(...run.map.map((n) => n.col), 0) + 1;

  const reachable = (n: MapNode) => {
    if (run.currentNodeId == null) return n.row === 0;
    const cur = run.map.find((m) => m.id === run.currentNodeId);
    return cur ? cur.next.includes(n.id) : false;
  };

  const NODE_W = 64;
  const NODE_H = 64;
  const COL_GAP = 80;
  const ROW_GAP = 96;
  const PAD_X = 32;
  const PAD_Y = 32;
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
          <h1>{act.subtitle}</h1>
        </div>
        <div className="map-stats">
          <span className="stat-pill">
            <span className="stat-icon">❤</span> {run.playerHp} / {run.playerMaxHp}
          </span>
          <span className="stat-pill">
            <span className="stat-icon">💰</span> {run.gold}
          </span>
          <button className="stat-pill stat-clickable" onClick={() => setShowDeck(true)}>
            <span className="stat-icon">📜</span> 牌组 {run.deck.length}
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
                <div className="node-label">{TYPE_LABEL[n.type]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {showDeck && <DeckModal onClose={() => setShowDeck(false)} />}
    </div>
  );
}
