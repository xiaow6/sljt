import { actions, useRun } from "../store";
import { CardView } from "./CardView";

export function RestScreen() {
  const run = useRun();
  const isUpgradeMode = run.screen === "rest_upgrade";

  if (isUpgradeMode) {
    return (
      <div className="rest-screen">
        <div className="rest-upgrade-panel">
          <div className="rest-header">
            <h2>选择一张牌升级</h2>
            <button className="btn-skip" onClick={() => actions.restCancel()}>
              返回
            </button>
          </div>
          <div className="rest-upgrade-grid">
            {run.deck.map((card, i) => (
              <button
                key={i}
                className="rest-card-pick"
                disabled={!!card.upgraded}
                onClick={() => actions.restUpgradeCard(i)}
              >
                <CardView card={card} />
                {card.upgraded && <div className="rest-upgraded-badge">已升级</div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const healAmount = Math.floor(run.playerMaxHp * 0.3);
  return (
    <div className="rest-screen">
      <div className="rest-card">
        <div className="rest-icon">🔧</div>
        <h1 className="rest-title">休整点</h1>
        <p className="rest-flavor">
          走廊深处有一个废弃的人类前哨。装置仍能运作。你只能选择一项。
        </p>
        <div className="rest-choices">
          <button className="rest-choice rest-choice-heal" onClick={() => actions.restHeal()}>
            <div className="rest-choice-icon">❤</div>
            <div className="rest-choice-name">休息</div>
            <div className="rest-choice-desc">治疗 {healAmount} HP</div>
          </button>
          <button className="rest-choice rest-choice-upgrade" onClick={() => actions.restUpgradeOpen()}>
            <div className="rest-choice-icon">⚙</div>
            <div className="rest-choice-name">改装台</div>
            <div className="rest-choice-desc">永久升级一张卡牌</div>
          </button>
        </div>
      </div>
    </div>
  );
}
