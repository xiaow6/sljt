// Lightweight i18n with a global language and React subscription.
import { useSyncExternalStore } from "react";
import { STRINGS } from "./i18n.strings";

export type Lang = "zh" | "en";
const KEY = "sljt:lang";

function readInitial(): Lang {
  if (typeof localStorage === "undefined") return "zh";
  const v = localStorage.getItem(KEY);
  return v === "en" ? "en" : "zh";
}

let lang: Lang = readInitial();
const listeners = new Set<() => void>();

export function getLang(): Lang {
  return lang;
}

export function setLang(l: Lang) {
  if (lang === l) return;
  lang = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, getLang);
}

export function t(key: string, fallback?: string): string {
  return (
    STRINGS[lang]?.[key] ?? fallback ?? STRINGS.zh[key] ?? key
  );
}
