import { useState } from "react";
import { actions } from "../store";

interface Props {
  onClose: () => void;
}

export function MenuModal({ onClose }: Props) {
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal menu-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>菜单</h2>
          <button onClick={onClose}>关闭</button>
        </div>
        <div className="menu-body">
          <div className="menu-save-status">
            <span className="menu-save-icon">💾</span>
            <div>
              <div className="menu-save-title">已自动保存</div>
              <div className="menu-save-sub">
                浏览器关掉再打开,标题屏会显示「继续游戏」按钮
              </div>
            </div>
          </div>
          <button
            className="menu-action"
            onClick={() => actions.returnToTitle()}
          >
            返回标题屏
            <span className="menu-action-hint">存档保留,随时回来继续</span>
          </button>
          {!confirmAbandon ? (
            <button
              className="menu-action menu-action-danger"
              onClick={() => setConfirmAbandon(true)}
            >
              放弃当前局
              <span className="menu-action-hint">清除存档,从头开始</span>
            </button>
          ) : (
            <div className="menu-confirm">
              <div className="menu-confirm-text">确认放弃?存档将永久清除。</div>
              <div className="menu-confirm-actions">
                <button
                  className="menu-action menu-action-danger"
                  onClick={() => actions.abandonRun()}
                >
                  确认放弃
                </button>
                <button
                  className="menu-action"
                  onClick={() => setConfirmAbandon(false)}
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
