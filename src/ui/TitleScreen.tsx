import { actions, hasSave } from "../store";

export function TitleScreen() {
  const canContinue = hasSave();
  return (
    <div className="title-screen">
      <div className="title-stars" />
      <div className="title-content">
        <div className="title-eyebrow">人类深空探索军 · 第七巡航舰队</div>
        <h1 className="title-name">深空爬塔</h1>
        <h2 className="title-subname">先驱者母舰</h2>
        <p className="title-flavor">
          外缘星域,你唤醒了沉睡十亿年的「先驱者」——一支硅基外星文明。
          <br />
          孤身一人,你必须穿越他们的母舰,在到达核心之前撑住每一次冲锋。
        </p>
        <div className="title-meta">
          <div className="title-meta-item">
            <span className="title-meta-label">职业</span>
            <span className="title-meta-value">指挥官 · 纯科技流</span>
          </div>
          <div className="title-meta-item">
            <span className="title-meta-label">起始 HP</span>
            <span className="title-meta-value">70</span>
          </div>
          <div className="title-meta-item">
            <span className="title-meta-label">核心机制</span>
            <span className="title-meta-value">⚡ 充能 · 换血科技</span>
          </div>
        </div>
        <div className="title-buttons">
          {canContinue && (
            <button
              className="btn-primary btn-large"
              onClick={() => actions.continueRun()}
            >
              继续游戏
            </button>
          )}
          <button
            className={canContinue ? "btn-large btn-secondary" : "btn-primary btn-large"}
            onClick={() => actions.newRun()}
          >
            {canContinue ? "新游戏" : "启航"}
          </button>
        </div>
      </div>
    </div>
  );
}
