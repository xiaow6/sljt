import { useState } from "react";
import { actions, useRun } from "../store";
import { RelicBar } from "./RelicBar";
import { DeckModal } from "./DeckModal";

const TYPE_LABEL: Record<string, string> = {
  battle: "战斗",
  elite: "精英",
  rest: "休整",
  shop: "商店",
  boss: "BOSS",
  unknown: "未知",
};

const TYPE_ICON: Record<string, string> = {
  battle: "⚔",
  elite: "★",
  rest: "🔧",
  shop: "💠",
  boss: "👁",
  unknown: "?",
};

export function MapScreen() {
  const run = useRun();
  const [showDeck, setShowDeck] = useState(false);
  return (
    <div className="map-screen">
      <div className="map-header">
        <h1>先驱者母舰</h1>
        <div className="map-stats">
          <span className="stat-pill">
            <span className="stat-icon">❤</span> {run.playerHp} / {run.playerMaxHp}
          </span>
          <button className="stat-pill stat-clickable" onClick={() => setShowDeck(true)}>
            <span className="stat-icon">📜</span> 牌组 {run.deck.length}
          </button>
        </div>
      </div>
      <RelicBar />
      <div className="map-track">
        {run.map.map((node, i) => {
          const status =
            i < run.currentNode
              ? "node-done"
              : i === run.currentNode
                ? "node-current"
                : "node-future";
          return (
            <div key={node.id} className={`map-node ${status} node-${node.type}`}>
              <button
                disabled={i !== run.currentNode}
                onClick={() => actions.enterNode(i)}
              >
                <div className="node-icon">{TYPE_ICON[node.type]}</div>
                <div className="node-label">{TYPE_LABEL[node.type]}</div>
              </button>
            </div>
          );
        })}
      </div>
      {showDeck && <DeckModal onClose={() => setShowDeck(false)} />}
    </div>
  );
}
