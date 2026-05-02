import { useState } from "react";
import { actions, hasSave } from "../store";
import { getLang, setLang, t, useLang } from "../i18n";
import { CodexModal } from "./CodexModal";

export function TitleScreen() {
  useLang();
  const canContinue = hasSave();
  const [showCodex, setShowCodex] = useState(false);
  return (
    <div className="title-screen">
      <div className="title-stars" />
      <button
        className="title-lang-btn"
        onClick={() => setLang(getLang() === "zh" ? "en" : "zh")}
        title="Toggle language"
      >
        {t("title.lang")}
      </button>
      <div className="title-content">
        <div className="title-eyebrow">{t("title.eyebrow")}</div>
        <h1 className="title-name">{t("app.title")}</h1>
        <h2 className="title-subname">{t("title.subtitle")}</h2>
        <p className="title-flavor">
          {t("title.flavor")
            .split("\n")
            .map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
        </p>
        <div className="title-meta">
          <div className="title-meta-item">
            <span className="title-meta-label">{t("title.role.label")}</span>
            <span className="title-meta-value">{t("title.role.value")}</span>
          </div>
          <div className="title-meta-item">
            <span className="title-meta-label">{t("title.hp.label")}</span>
            <span className="title-meta-value">70</span>
          </div>
          <div className="title-meta-item">
            <span className="title-meta-label">{t("title.mech.label")}</span>
            <span className="title-meta-value">{t("title.mech.value")}</span>
          </div>
        </div>
        <div className="title-buttons">
          {canContinue && (
            <button
              className="btn-primary btn-large"
              onClick={() => actions.continueRun()}
            >
              {t("title.continue")}
            </button>
          )}
          <button
            className={canContinue ? "btn-large btn-secondary" : "btn-primary btn-large"}
            onClick={() => actions.newRun()}
          >
            {canContinue ? t("title.new") : t("title.start")}
          </button>
          <button
            className="btn-large btn-secondary"
            onClick={() => setShowCodex(true)}
          >
            📖 {t("title.codex")}
          </button>
        </div>
      </div>
      {showCodex && <CodexModal onClose={() => setShowCodex(false)} />}
    </div>
  );
}

