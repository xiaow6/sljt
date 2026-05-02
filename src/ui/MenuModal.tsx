import { useState } from "react";
import { actions } from "../store";
import { t, useLang } from "../i18n";

interface Props {
  onClose: () => void;
}

export function MenuModal({ onClose }: Props) {
  useLang();
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal menu-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("menu.title")}</h2>
          <button onClick={onClose}>{t("common.close")}</button>
        </div>
        <div className="menu-body">
          <div className="menu-save-status">
            <span className="menu-save-icon">💾</span>
            <div>
              <div className="menu-save-title">{t("menu.saved")}</div>
              <div className="menu-save-sub">{t("menu.savedHint")}</div>
            </div>
          </div>
          <button
            className="menu-action"
            onClick={() => actions.returnToTitle()}
          >
            {t("menu.returnToTitle")}
            <span className="menu-action-hint">{t("menu.returnToTitleHint")}</span>
          </button>
          {!confirmAbandon ? (
            <button
              className="menu-action menu-action-danger"
              onClick={() => setConfirmAbandon(true)}
            >
              {t("menu.abandon")}
              <span className="menu-action-hint">{t("menu.abandonHint")}</span>
            </button>
          ) : (
            <div className="menu-confirm">
              <div className="menu-confirm-text">{t("menu.confirmAbandon")}</div>
              <div className="menu-confirm-actions">
                <button
                  className="menu-action menu-action-danger"
                  onClick={() => actions.abandonRun()}
                >
                  {t("menu.confirm")}
                </button>
                <button
                  className="menu-action"
                  onClick={() => setConfirmAbandon(false)}
                >
                  {t("menu.cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
