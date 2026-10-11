# Key-Momente

Ein persönliches Logbuch für Erkenntnisse, die bleiben sollen. Die Seite zeigt sie als scrollbaren Zeitstrahl im Stil eines Messgeräts: eine Skala mit einem Teilstrich pro Tag und einem Hauptstrich pro Kalenderwoche. Der Moment an der Lesekante fährt seitlich aus.

Das Repo ist öffentlich, die Momente sind es nicht. Sie liegen nur verschlüsselt in `momente.enc.json` (AES-256-GCM, Schlüssel per PBKDF2-SHA256 mit 250 000 Runden aus einer Passphrase). Die Seite entschlüsselt im Browser; ohne Passphrase sieht man nur die leere Skala.

## Aufbau

| Datei | Zweck |
| --- | --- |
| `index.html` | die ganze Seite, ohne Build-Schritt |
| `momente.enc.json` | die verschlüsselten Momente |
| `tools/moment.mjs` | Momente hinzufügen, ändern, löschen (Node 20+) |

## Momente pflegen

Die Passphrase kommt immer aus der Umgebungsvariable `MOMENTE_PASS` und wird nie eingecheckt.

```sh
export MOMENTE_PASS="…"
node tools/moment.mjs list
node tools/moment.mjs add --titel "Nicht nur der Happy Path" --bereich "seca" --text "…"
node tools/moment.mjs edit 2026-10-11-compositor --titel "Compositor statt Photoshop"
node tools/moment.mjs delete <id>
MOMENTE_NEW_PASS="…" node tools/moment.mjs rekey   # Passphrase wechseln
```

Danach committen und pushen. GitHub Pages zeigt den neuen Stand nach etwa einer Minute.

## Auf dem iPhone

Seite in Safari öffnen, Passphrase einmal eingeben („Auf diesem Gerät merken“), dann Teilen → „Zum Home-Bildschirm“. Mit der Schloss-Taste wird die Passphrase vom Gerät entfernt.

## Gestaltung

Stil „Instrument“: warmgraues Aluminium, eingelassene Mulden, eine Signalfarbe (#F05A22), Archivo und Geist Mono. Hell und dunkel folgen der Systemeinstellung.
