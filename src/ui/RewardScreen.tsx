import { actions, getPendingRelic, useRun } from "../store";
import { CardView } from "./CardView";
import { RELICS } from "../game/relics";

export function RewardScreen() {
  const run = useRun();
  const cards = run.rewardCards ?? [];
  const relicId = getPendingRelic();
  const relic = relicId ? RELICS[relicId] : null;
  return (
    <div className="reward-screen">
      <h2>战利品 — 选一张牌</h2>
      {relic && (
        <div className="reward-relic">
          <div className="reward-relic-icon">{relic.icon}</div>
          <div>
            <div className="reward-relic-name">遗物 · {relic.name}</div>
            <div className="reward-relic-desc">{relic.description}</div>
            <div className="reward-relic-hint">(选完牌后自动获得)</div>
          </div>
        </div>
      )}
      <div className="reward-cards">
        {cards.map((c, i) => (
          <CardView key={i} card={c} onClick={() => actions.takeReward(c)} />
        ))}
      </div>
      <button className="btn-skip" onClick={() => actions.takeReward(null)}>
        跳过
      </button>
    </div>
  );
}
