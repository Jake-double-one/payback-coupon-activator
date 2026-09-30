# Payback Activate Coupons Slowly

**[English](#english) · [Deutsch](#deutsch)**

## English

Tampermonkey userscript for [payback.de/coupons](https://www.payback.de/coupons) that activates
all non-activated coupons – **one by one with a short delay instead of all at once**, so Payback
does not temporarily block the account.

Fork of ["Payback Manual Activate Coupons"](https://greasyfork.org/scripts/551764) by
[Denis-Alexeev](https://github.com/Denis-Alexeev/MyUserScripts) (MIT).

### How it works

- Clicking **▶ Activate Coupons** counts all non-activated coupons.
- Clicks them one after another with a random delay of 250–600 ms (≈ 70 s for 160 coupons).
- The button shows the progress (`⏳ 73/163`); clicking it again stops.
- The delay can be changed via `CLICK_DELAY_MIN` / `CLICK_DELAY_MAX` at the top of the script.

### Installation

1. Install [Tampermonkey](https://tampermonkey.net/).
2. Open [`payback-coupon-activator.user.js`](https://github.com/Jake-double-one/payback-coupon-activator/raw/main/payback-coupon-activator.user.js)
   – Tampermonkey will offer to install it.

If the original script is installed, disable it first, otherwise two buttons will appear.

## Deutsch

**[English](#english) · [Deutsch](#deutsch)**

## English

Tampermonkey userscript for [payback.de/coupons](https://www.payback.de/coupons) that activates
all non-activated coupons – **in batches instead of all at once**, so Payback does not
temporarily block the account.

Fork of ["Payback Manual Activate Coupons"](https://greasyfork.org/scripts/551764) by
[Denis-Alexeev](https://github.com/Denis-Alexeev/MyUserScripts) (MIT).

### How it works

- Clicking **▶ Activate Coupons** counts all non-activated coupons.
- Activates them in batches (default: **50**), with a random delay of 250–600 ms per click.
- Pauses between batches (default: **8 s**) and re-reads the page afterwards.
- The button shows the progress (`⏳ 73/163`) or the pause countdown; clicking it again stops.
- Use **⚙** to change the batch size and pause (stored in `localStorage`).

### Installation

1. Install [Tampermonkey](https://tampermonkey.net/).
2. Open [`payback-coupon-activator.user.js`](https://github.com/Jake-double-one/payback-coupon-activator/raw/main/payback-coupon-activator.user.js)
   – Tampermonkey will offer to install it.

If the original script is installed, disable it first, otherwise two buttons will appear.

## Deutsch

Tampermonkey-Userscript für [payback.de/coupons](https://www.payback.de/coupons), das alle
nicht aktivierten Gutscheine aktiviert – **nacheinander mit kurzer Verzögerung statt alle auf einmal**,
damit Payback das Konto nicht vorübergehend sperrt.

Fork von [„Payback Manual Activate Coupons“](https://greasyfork.org/scripts/551764) von
[Denis-Alexeev](https://github.com/Denis-Alexeev/MyUserScripts) (MIT).

### Funktionsweise

- Zählt beim Klick auf **▶ Gutscheine aktivieren** alle nicht aktivierten Gutscheine.
- Klickt sie nacheinander mit 250–600 ms zufälliger Verzögerung an (≈ 70 s für 160 Gutscheine).
- Der Knopf zeigt den Fortschritt (`⏳ 73/163`); ein erneuter Klick stoppt.
- Die Verzögerung lässt sich über `CLICK_DELAY_MIN` / `CLICK_DELAY_MAX` oben im Skript ändern.

### Installation

1. [Tampermonkey](https://tampermonkey.net/) installieren.
2. [`payback-coupon-activator.user.js`](https://github.com/Jake-double-one/payback-coupon-activator/raw/main/payback-coupon-activator.user.js)
   öffnen – Tampermonkey bietet die Installation an.

Falls das Original-Skript installiert ist, dieses vorher deaktivieren, sonst erscheinen zwei Knöpfe.
