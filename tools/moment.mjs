#!/usr/bin/env node
// Verwaltet die verschlüsselten Key-Momente in momente.enc.json.
// Passphrase kommt aus der Umgebungsvariable MOMENTE_PASS und landet nie im Repo.
//
//   node tools/moment.mjs list
//   node tools/moment.mjs add --titel "…" --bereich "…" --text "…" [--datum 2026-10-11T18:00:00+02:00]
//   node tools/moment.mjs edit <id> [--titel …] [--bereich …] [--text …] [--datum …]
//   node tools/moment.mjs delete <id>
//   node tools/moment.mjs import <datei.json>      (Klartext-Liste einlesen, ersetzt alles)
//   node tools/moment.mjs rekey                     (neue Passphrase aus MOMENTE_NEW_PASS)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { webcrypto as crypto, randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "..", "momente.enc.json");
const ITER = 250000;
const enc = new TextEncoder(), dec = new TextDecoder();
const b64 = (u8) => Buffer.from(u8).toString("base64");
const unb64 = (s) => new Uint8Array(Buffer.from(s, "base64"));

async function key(pass, salt, usage) {
  const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, [usage]);
}
async function load(pass) {
  if (!existsSync(FILE)) return [];
  const box = JSON.parse(readFileSync(FILE, "utf8"));
  const k = await key(pass, unb64(box.salt), "decrypt");
  try {
    return JSON.parse(dec.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(box.iv) }, k, unb64(box.data))));
  } catch {
    fail("Passphrase passt nicht zu momente.enc.json.");
  }
}
async function save(list, pass) {
  list.sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const salt = randomBytes(16), iv = randomBytes(12);
  const k = await key(pass, salt, "encrypt");
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, k, enc.encode(JSON.stringify(list)));
  const box = { v: 1, kdf: "PBKDF2-SHA256", iter: ITER, salt: b64(salt), iv: b64(iv), data: b64(new Uint8Array(data)) };
  writeFileSync(FILE, JSON.stringify(box, null, 2) + "\n");
}
function fail(msg) { console.error(msg); process.exit(1); }
function flags(args) {
  const o = {};
  for (let i = 0; i < args.length; i++) if (args[i].startsWith("--")) o[args[i].slice(2)] = args[++i] ?? "";
  return o;
}
function slug(s) {
  return (s || "moment").toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 40) || "moment";
}

const pass = process.env.MOMENTE_PASS;
if (!pass) fail("MOMENTE_PASS ist nicht gesetzt.");
const [cmd, ...rest] = process.argv.slice(2);
let list = await load(pass);

if (cmd === "list") {
  for (const m of list) console.log(`${m.id}\n  ${m.datum} · ${m.bereich || "–"}\n  ${m.titel || "(ohne Titel)"}\n  ${m.text}\n`);
} else if (cmd === "add") {
  const f = flags(rest);
  if (!f.text) fail("--text fehlt.");
  const datum = f.datum || new Date().toISOString();
  let id = datum.slice(0, 10) + "-" + slug(f.titel);
  while (list.some((m) => m.id === id)) id += "-2";
  list.push({ id, datum, titel: f.titel || "", bereich: f.bereich || "", text: f.text });
  await save(list, pass); console.log("Hinzugefügt:", id);
} else if (cmd === "edit") {
  const [id, ...more] = rest; const f = flags(more);
  const m = list.find((x) => x.id === id) || fail(`Kein Moment mit id ${id}.`);
  for (const k of ["titel", "bereich", "text", "datum"]) if (k in f) m[k] = f[k];
  await save(list, pass); console.log("Geändert:", id);
} else if (cmd === "delete") {
  const before = list.length; list = list.filter((x) => x.id !== rest[0]);
  if (list.length === before) fail(`Kein Moment mit id ${rest[0]}.`);
  await save(list, pass); console.log("Gelöscht:", rest[0]);
} else if (cmd === "import") {
  list = JSON.parse(readFileSync(rest[0], "utf8"));
  await save(list, pass); console.log(`Importiert: ${list.length} Momente.`);
} else if (cmd === "rekey") {
  const np = process.env.MOMENTE_NEW_PASS || fail("MOMENTE_NEW_PASS ist nicht gesetzt.");
  await save(list, np); console.log("Neu verschlüsselt.");
} else {
  fail("Befehle: list | add | edit | delete | import | rekey");
}
