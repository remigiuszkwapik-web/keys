# Key-Momente — Hinweise für Claude Code

- Remi spricht Momente meist frei ein. Daraus einen kurzen Titel (3–6 Wörter) und einen sauberen Text machen, seine Worte aber nicht umdeuten. Bereich nur setzen, wenn er ihn nennt oder er eindeutig ist (z. B. „seca“, „CO₂-Monitor“).
- Momente nur über `tools/moment.mjs` ändern, nie `momente.enc.json` von Hand. Die Passphrase steht in `MOMENTE_PASS`; fehlt sie, Remi danach fragen und sie nie in Dateien, Commits oder Logs schreiben.
- Nach jeder Änderung: `node tools/moment.mjs list` zur Kontrolle, dann committen („Moment: <Titel>“) und pushen.
- Gestaltung folgt dem Design-System „Instrument“: Farben nur aus den Tokens oben in `index.html`, eine Signalfarbe, keine Verläufe, keine Emojis, keine schwebenden Karten.
- Kein Build-Schritt, keine Abhängigkeiten. `index.html` bleibt eine einzelne Datei.
