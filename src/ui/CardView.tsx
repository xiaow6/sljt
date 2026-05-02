import { useState } from "react";
import type { CardDef } from "../game/types";

interface Props {
  card: CardDef;
  playable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  small?: boolean;
}

export function CardView({ card, playable = true, selected, onClick, small }: Props) {
  const typeColor =
    card.type === "attack"
      ? "card-attack"
      : card.type === "skill"
        ? "card-skill"
        : "card-power";
  const [imgOk, setImgOk] = useState(true);
  const showImg = !!card.art && imgOk;
  const rarityClass = card.rarity ? `card-rarity-${card.rarity}` : "";
  return (
    <div
      className={`card ${typeColor} ${rarityClass} ${playable ? "" : "card-unplayable"} ${
        selected ? "card-selected" : ""
      } ${small ? "card-small" : ""}`}
      onClick={onClick}
    >
      <div className="card-cost">{card.cost === "X" ? "X" : card.cost}</div>
      <div className="card-name">{card.name}</div>
      <div className="card-art">
        {showImg && (
          <img
            src={`/art/${card.art}`}
            alt={card.name}
            onError={() => setImgOk(false)}
            className="card-art-img"
          />
        )}
        {!showImg && <div className="card-art-placeholder">{card.name}</div>}
      </div>
      <div className="card-type-banner">{labelType(card.type)}</div>
      <div className="card-desc">{card.description}</div>
    </div>
  );
}

function labelType(t: CardDef["type"]) {
  if (t === "attack") return "攻击";
  if (t === "skill") return "技能";
  return "能力";
}
