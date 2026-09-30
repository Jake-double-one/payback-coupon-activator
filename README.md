# Payback Batch Activate Coupons

Tampermonkey-Userscript für [payback.de/coupons](https://www.payback.de/coupons), das alle
nicht aktivierten Gutscheine aktiviert – **in Paketen statt alle auf einmal**, damit Payback
das Konto nicht vorübergehend sperrt.

Fork von [„Payback Manual Activate Coupons“](https://greasyfork.org/scripts/551764) von
[Denis-Alexeev](https://github.com/Denis-Alexeev/MyUserScripts) (MIT).

## Funktionsweise

- Zählt beim Klick auf **▶ Gutscheine aktivieren** alle nicht aktivierten Gutscheine.
- Aktiviert sie in Paketen (Standard: **50**), mit 250–600 ms zufälliger Verzögerung pro Klick.
- Macht zwischen den Paketen eine Pause (Standard: **8 s**) und liest die Seite danach neu ein.
- Der Knopf zeigt den Fortschritt (`⏳ 73/163`) bzw. den Pausen-Countdown; ein erneuter Klick stoppt.
- Über **⚙** lassen sich Paketgröße und Pause ändern (gespeichert im `localStorage`).

## Installation

1. [Tampermonkey](https://tampermonkey.net/) installieren.
2. Die Datei [`payback-coupon-activator.user.js`](payback-coupon-activator.user.js) im Raw-Modus
   öffnen – Tampermonkey bietet die Installation an.

Falls das Original-Skript installiert ist, dieses vorher deaktivieren, sonst erscheinen zwei Knöpfe.
