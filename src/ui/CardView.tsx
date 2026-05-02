import { useState } from "react";
import type { CardDef } from "../game/types";
import { useLang, t } from "../i18n";
import { cardName, cardDescription } from "../game/lookup";

interface Props {
  card: CardDef;
  playable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  small?: boolean;
}

export function CardView({ card, playable = true, selected, onClick, small }: Props) {
  useLang(); // re-render on language switch
  const typeColor =
    card.type === "attack"
      ? "card-attack"
      : card.type === "skill"
        ? "card-skill"
        : "card-power";
  const [imgOk, setImgOk] = useState(true);
  const showImg = !!card.art && imgOk;
  const rarityClass = card.rarity ? `card-rarity-${card.rarity}` : "";
  const name = cardName(card);
  const desc = cardDescription(card);
  return (
    <div
      className={`card ${typeColor} ${rarityClass} ${playable ? "" : "card-unplayable"} ${
        selected ? "card-selected" : ""
      } ${small ? "card-small" : ""}`}
      onClick={onClick}
    >
      <div className="card-cost">{card.cost === "X" ? "X" : card.cost}</div>
      <div className="card-name">{name}</div>
      <div className="card-art">
        {showImg && (
          <img
            src={`/art/${card.art}`}
            alt={name}
            onError={() => setImgOk(false)}
            className="card-art-img"
          />
        )}
        {!showImg && <div className="card-art-placeholder">{name}</div>}
      </div>
      <div className="card-type-banner">{labelType(card.type)}</div>
      <div className="card-desc">{desc}</div>
    </div>
  );
}

function labelType(ty: CardDef["type"]) {
  if (ty === "attack") return t("ctype.attack");
  if (ty === "skill") return t("ctype.skill");
  return t("ctype.power");
}
