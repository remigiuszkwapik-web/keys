# Key-Momente — Hinweise für Claude Code

- Remi spricht Momente meist frei ein. Daraus einen kurzen Titel (3–6 Wörter) und einen sauberen Text machen, seine Worte aber nicht umdeuten. Bereich nur setzen, wenn er ihn nennt oder er eindeutig ist (z. B. „seca“, „CO₂-Monitor“).
- Momente liegen lokal im Browser (localStorage, Schlüssel `km-momente-v1`), nie im Repo. Keine Momente im Klartext committen.
- `momente.enc.json` nur über `tools/moment.mjs` ändern. Die Passphrase steht in `MOMENTE_PASS`; nie in Dateien, Commits oder Logs schreiben.
- Das Backup-Format ist eine JSON-Liste aus {id, datum, titel, bereich, text}. Änderungen daran müssen alte Backups weiter einlesen können.
- Gestaltung folgt dem Design-System „Instrument“: Farben nur aus den Tokens oben in `index.html`, eine Signalfarbe, keine Verläufe, keine Emojis, keine schwebenden Karten.
- Kein Build-Schritt, keine Abhängigkeiten. `index.html` bleibt eine einzelne Datei.
