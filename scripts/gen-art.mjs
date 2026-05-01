#!/usr/bin/env node
// Batch generate card / enemy art via Poe gpt-image-2.
// Usage: POE_KEY=sk-poe-... node scripts/gen-art.mjs [cards|enemies|all]
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const POE_KEY = process.env.POE_KEY;
if (!POE_KEY) {
  console.error("Missing POE_KEY env var");
  process.exit(1);
}

const promptsPath = path.join(ROOT, "scripts", "prompts.json");
const cfg = JSON.parse(await fs.readFile(promptsPath, "utf8"));
const STYLE = cfg.style_base;

const target = process.argv[2] || "all";
const jobs = [];
if (target === "enemies" || target === "all") {
  for (const e of cfg.enemies) {
    jobs.push({
      group: "enemies",
      id: e.id,
      name: e.name,
      prompt: `${e.prompt}. ${STYLE}`,
    });
  }
}
if (target === "scenes" || target === "all") {
  for (const s of cfg.scenes ?? []) {
    jobs.push({
      group: "scenes",
      id: s.id,
      name: s.name,
      prompt: `${s.prompt}. ${STYLE}`,
    });
  }
}
if (target === "portraits" || target === "all") {
  for (const p of cfg.portraits ?? []) {
    jobs.push({
      group: "portraits",
      id: p.id,
      name: p.name,
      prompt: `${p.prompt}. ${STYLE}`,
    });
  }
}
if (target === "cards" || target === "all") {
  for (const c of cfg.cards) {
    jobs.push({
      group: "cards",
      id: c.id,
      name: c.name,
      prompt: `${c.prompt}. ${STYLE}`,
    });
  }
}

async function generateWith(model, prompt, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch("https://api.poe.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${POE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "";
    const m = content.match(/\((https?:\/\/[^)]+)\)/);
    if (!m) throw new Error(`No image URL in response: ${content.slice(0, 200)}`);
    return m[1];
  } finally {
    clearTimeout(timer);
  }
}

async function generate(prompt) {
  // Try primary model with 180s. Fall back to flux-2-pro on failure.
  try {
    return await generateWith("gpt-image-2", prompt, 180_000);
  } catch (e) {
    process.stdout.write(`(fallback flux-2-pro) `);
    return await generateWith("flux-2-pro", prompt, 180_000);
  }
}

async function download(url, outPath) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Download HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.writeFile(outPath, buf);
}

const ART_DIR = path.join(ROOT, "public", "art");
await fs.mkdir(path.join(ART_DIR, "cards"), { recursive: true });
await fs.mkdir(path.join(ART_DIR, "enemies"), { recursive: true });
await fs.mkdir(path.join(ART_DIR, "scenes"), { recursive: true });
await fs.mkdir(path.join(ART_DIR, "portraits"), { recursive: true });

let ok = 0,
  fail = 0;
for (const j of jobs) {
  const outPath = path.join(ART_DIR, j.group, `${j.id}.png`);
  try {
    const stat = await fs.stat(outPath).catch(() => null);
    if (stat && stat.size > 10_000) {
      console.log(`[skip] ${j.group}/${j.id} (already exists)`);
      ok++;
      continue;
    }
    process.stdout.write(`[gen ] ${j.group}/${j.id} (${j.name})... `);
    const url = await generate(j.prompt);
    await download(url, outPath);
    console.log(`OK ${(await fs.stat(outPath)).size} bytes`);
    ok++;
  } catch (e) {
    console.log(`FAIL: ${e.message}`);
    fail++;
  }
}
console.log(`\nDone. ok=${ok} fail=${fail}`);
