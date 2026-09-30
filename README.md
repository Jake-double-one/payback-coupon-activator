# Payback Coupon Activator

**[English](#english) · [Deutsch](#deutsch)**

## English

Tampermonkey userscript for [payback.de/coupons](https://www.payback.de/coupons) that activates
all non-activated coupons – **one by one with a short delay instead of all at once**, so Payback
does not temporarily block the account.

Fork of ["Payback Manual Activate Coupons"](https://greasyfork.org/scripts/551764) by
[Denis-Alexeev](https://github.com/Denis-Alexeev/MyUserScripts) (MIT).

### How it works

- Clicking **▶ Activate Coupons** counts all non-activated coupons.
- Clicks them one after another with a random delay of 10–250 ms (≈ 20 s for 150 coupons).
- The button shows the progress (`⏳ 73/163`); clicking it again stops.
- The delay can be changed via `CLICK_DELAY_MIN` / `CLICK_DELAY_MAX` at the top of the script.

> **Note:** Payback's exact limits are unknown. The 10–250 ms delay is a guess: activating
> about 150 coupons at once worked, while more than 160 at once triggered a temporary block.
> If you get blocked, increase the delay.

### Installation

1. Install [Tampermonkey](https://tampermonkey.net/).
2. Open [`payback-coupon-activator.user.js`](https://github.com/Jake-double-one/payback-coupon-activator/raw/main/payback-coupon-activator.user.js)
   – Tampermonkey will offer to install it.

Updates are installed automatically: Tampermonkey checks the script on GitHub regularly
(default: daily) and installs newer versions.

If the original script or an older version of this script under a different name
(e.g. "Payback Activate Coupons Slowly") is installed, remove it, otherwise two buttons will appear.

## Deutsch

Tampermonkey-Userscript für [payback.de/coupons](https://www.payback.de/coupons), das alle
nicht aktivierten Gutscheine aktiviert – **nacheinander mit kurzer Verzögerung statt alle auf einmal**,
damit Payback das Konto nicht vorübergehend sperrt.

Fork von [„Payback Manual Activate Coupons“](https://greasyfork.org/scripts/551764) von
[Denis-Alexeev](https://github.com/Denis-Alexeev/MyUserScripts) (MIT).

### Funktionsweise

- Zählt beim Klick auf **▶ Gutscheine aktivieren** alle nicht aktivierten Gutscheine.
- Klickt sie nacheinander mit 10–250 ms zufälliger Verzögerung an (≈ 20 s für 150 Gutscheine).
- Der Knopf zeigt den Fortschritt (`⏳ 73/163`); ein erneuter Klick stoppt.
- Die Verzögerung lässt sich über `CLICK_DELAY_MIN` / `CLICK_DELAY_MAX` oben im Skript ändern.

> **Hinweis:** Die genauen Limits von Payback sind nicht bekannt. Die 10–250 ms sind ein Erfahrungswert:
> Rund 150 Gutscheine auf einmal zu aktivieren hat funktioniert, bei über 160 auf einmal kam eine
> vorübergehende Sperre. Falls du gesperrt wirst, erhöhe die Verzögerung.

### Installation

1. [Tampermonkey](https://tampermonkey.net/) installieren.
2. [`payback-coupon-activator.user.js`](https://github.com/Jake-double-one/payback-coupon-activator/raw/main/payback-coupon-activator.user.js)
   öffnen – Tampermonkey bietet die Installation an.

Updates werden automatisch installiert: Tampermonkey prüft das Skript regelmäßig auf GitHub
(Standard: täglich) und installiert neuere Versionen.

Falls das Original-Skript oder eine ältere Version dieses Skripts unter anderem Namen
(z. B. „Payback Activate Coupons Slowly“) installiert ist, diese entfernen, sonst erscheinen zwei Knöpfe.
