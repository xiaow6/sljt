import { useState } from "react";
import { actions, useRun } from "../store";
import { CardView } from "./CardView";
import { t, useLang } from "../i18n";

type Mode = "browse" | "upgrade" | "remove";

export function ShopScreen() {
  useLang();
  const run = useRun();
  const [mode, setMode] = useState<Mode>("browse");
  const shop = run.shop;
  if (!shop) return null;

  return (
    <div className="shop-screen">
      <div className="shop-card">
        <div className="shop-header">
          <div>
            <div className="shop-eyebrow">{t("shop.eyebrow")}</div>
            <h1 className="shop-title">{t("shop.title")}</h1>
          </div>
          <div className="shop-balance">
            <span className="chip-icon">◈</span>
            <span className="chip-amount">{run.gold}</span>
            <span className="chip-label">{t("stat.chips")}</span>
          </div>
        </div>

        {mode === "browse" && (
          <>
            <div className="shop-section-label">{t("shop.section.cards")}</div>
            <div className="shop-cards-grid">
              {shop.cards.map((slot, i) => (
                <div key={i} className={`shop-slot ${slot.sold ? "shop-sold" : ""}`}>
                  <CardView card={slot.card} />
                  <button
                    className="shop-buy-btn"
                    disabled={slot.sold || run.gold < slot.price}
                    onClick={() => actions.shopBuyCard(i)}
                  >
                    {slot.sold ? t("shop.sold") : `◈ ${slot.price}`}
                  </button>
                </div>
              ))}
            </div>
            <div className="shop-services">
              <button
                className="shop-service"
                onClick={() => setMode("upgrade")}
                disabled={run.gold < shop.upgradePrice}
              >
                <div className="shop-service-icon">⚙</div>
                <div>
                  <div className="shop-service-name">{t("shop.svc.upgrade")}</div>
                  <div className="shop-service-price">◈ {shop.upgradePrice}</div>
                </div>
              </button>
              <button
                className="shop-service"
                onClick={() => setMode("remove")}
                disabled={shop.removalUsed || run.gold < shop.removalPrice}
              >
                <div className="shop-service-icon">🗑</div>
                <div>
                  <div className="shop-service-name">
                    {t("shop.svc.remove")} {shop.removalUsed && t("shop.svc.removed")}
                  </div>
                  <div className="shop-service-price">◈ {shop.removalPrice}</div>
                </div>
              </button>
            </div>
            <button className="shop-leave" onClick={() => actions.shopLeave()}>
              {t("shop.leave")}
            </button>
          </>
        )}

        {(mode === "upgrade" || mode === "remove") && (
          <>
            <div className="shop-pick-header">
              <h2>{mode === "upgrade" ? t("shop.pickUpgrade") : t("shop.pickRemove")}</h2>
              <button className="btn-skip" onClick={() => setMode("browse")}>
                {t("common.back")}
              </button>
            </div>
            <div className="shop-deck-grid">
              {run.deck.map((card, i) => {
                const disabled = mode === "upgrade" && !!card.upgraded;
                return (
                  <button
                    key={i}
                    className="rest-card-pick"
                    disabled={disabled}
                    onClick={() => {
                      if (mode === "upgrade") actions.shopUpgradeCard(i);
                      else actions.shopRemoveCard(i);
                      setMode("browse");
                    }}
                  >
                    <CardView card={card} />
                    {disabled && (
                      <div className="rest-upgraded-badge">{t("rest.upgraded")}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
