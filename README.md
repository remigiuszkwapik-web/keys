# Key-Momente

Ein persönliches Logbuch für Erkenntnisse, die bleiben sollen. Die Seite zeigt sie als scrollbaren Zeitstrahl im Stil eines Messgeräts: eine Skala mit einem Teilstrich pro Tag und einem Hauptstrich pro Kalenderwoche. Der Moment an der Lesekante fährt seitlich aus.

Die Momente liegen nur lokal im Browser des Geräts (localStorage) und nie im Repo. Auf der Seite legst du sie an, bearbeitest und löschst sie. Über „Backup speichern“ entsteht eine JSON-Datei, die sich mit „Backup laden“ wieder einspielen oder auf ein anderes Gerät bringen lässt.

`momente.enc.json` enthält die ersten Momente verschlüsselt (AES-256-GCM, PBKDF2-SHA256). Mit „Aus dem Repo übernehmen“ und der Passphrase lassen sie sich einmalig in den lokalen Speicher holen.

## Aufbau

| Datei | Zweck |
| --- | --- |
| `index.html` | die ganze Seite, ohne Build-Schritt |
| `momente.enc.json` | die verschlüsselten Momente |
| `tools/moment.mjs` | Momente hinzufügen, ändern, löschen (Node 20+) |

## Wichtig zum Speicher

Safari löscht den Speicher einer normalen Webseite, wenn sie sieben Tage nicht benutzt wurde. Auf dem Home-Bildschirm abgelegte Web-Apps sind davon ausgenommen. Deshalb die Seite als App ablegen und gelegentlich ein Backup sichern.

`tools/moment.mjs` pflegt nur noch die verschlüsselte Repo-Datei und wird für den Alltag nicht gebraucht.

## Auf dem iPhone

Seite in Safari öffnen, Teilen → „Zum Home-Bildschirm“, dann die App von dort starten. Neue Momente über die Plus-Taste, Einsprechen über das Mikrofon der Tastatur.

## Gestaltung

Stil „Instrument“: warmgraues Aluminium, eingelassene Mulden, eine Signalfarbe (#F05A22), Archivo und Geist Mono. Hell und dunkel folgen der Systemeinstellung.
