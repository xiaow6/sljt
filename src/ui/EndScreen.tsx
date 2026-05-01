import { actions, useRun } from "../store";
import { RELICS } from "../game/relics";

export function EndScreen() {
  const run = useRun();
  const won = run.screen === "victory";
  return (
    <div className={`end-screen ${won ? "end-win" : "end-lose"}`}>
      <h1>{won ? "胜利" : "阵亡"}</h1>
      <p className="end-flavor">
        {won
          ? "你击溃了织网者,母舰核心被你掌控。指挥官的传说从这里开始。"
          : "你的指挥官倒在了先驱者的爪下。深空再无回响。"}
      </p>
      <div className="end-stats">
        <div className="end-stat">
          <span className="end-stat-label">最终 HP</span>
          <span className="end-stat-value">
            {run.playerHp} / {run.playerMaxHp}
          </span>
        </div>
        <div className="end-stat">
          <span className="end-stat-label">牌组规模</span>
          <span className="end-stat-value">{run.deck.length}</span>
        </div>
        <div className="end-stat">
          <span className="end-stat-label">通过节点</span>
          <span className="end-stat-value">
            {run.currentNode} / {run.map.length}
          </span>
        </div>
      </div>
      {run.relics.length > 0 && (
        <div className="end-relics">
          <div className="end-relics-label">收集的遗物</div>
          <div className="end-relics-list">
            {run.relics.map((id) => {
              const r = RELICS[id];
              return r ? (
                <span key={id} className="end-relic">
                  {r.icon} {r.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
      <button className="btn-primary btn-large" onClick={() => actions.reset()}>
        再来一次
      </button>
    </div>
  );
}
