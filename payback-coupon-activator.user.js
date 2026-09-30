// ==UserScript==
// @name            Payback Activate Coupons Slowly
// @name:en         Payback Activate Coupons Slowly
// @name:ru         Payback активировать все купоны (с задержкой)
// @name:de         Payback Gutscheine verzögert aktivieren
// @namespace       https://github.com/jake-double-one/payback-coupon-activator
// @version         2.2.0
// @description:ru  Кнопка на странице для активации всех купонов по одному с задержкой
// @description:de  Schaltfläche zur Aktivierung aller Gutscheine nacheinander mit Verzögerung
// @description:en  Button on the page for activating all coupons one by one with a delay
// @description     Button on the page for activating all coupons one by one with a delay
// @match           https://www.payback.de/coupons*
// @grant           none
// @run-at          document-end
// @homepageURL     https://github.com/jake-double-one/payback-coupon-activator
// @supportURL      https://github.com/jake-double-one/payback-coupon-activator/issues
// @iconURL         https://www.payback.de/resource/blob/4506/b8323ff55b34054722769ae5652c22ae/main-favicon.ico
// @license         MIT
// ==/UserScript==

/*
Fork of "Payback Manual Activate Coupons" by Denis-Alexeev
(https://github.com/Denis-Alexeev/MyUserScripts, MIT License).

Changes in this fork:
- Coupons are activated one by one with a short random delay between clicks
  instead of all at once, so Payback does not soft-block the account.
- The button shows live progress and can be clicked again to stop.
*/

(function () {
    'use strict';

    // ---------- Settings ----------

    const CLICK_DELAY_MIN = 250; // ms between single clicks (min)
    const CLICK_DELAY_MAX = 600; // ms between single clicks (max)

    // ---------- Texts ----------

    let lang = localStorage.getItem('pb_lang') || (navigator.language || 'en').slice(0, 2);

    const TEXTS = {
        en: {
            btn: '▶ Activate Coupons',
            stop: '⏹ Stop',
            notFound: '❌ No non-activated coupons found',
            done: (c, t) => `✅ Done! Activated ${c}/${t} coupons.`,
            stopped: (c, t) => `⏹ Stopped. Activated ${c}/${t} coupons.`,
            found: (n) => `🔍 Found ${n} coupons.`,
            activated: (i) => `✅ Activated coupon #${i}`,
            progress: (c, t) => `⏳ ${c}/${t} – click to stop`,
            switchLabel: '🌐 Language:',
        },
        de: {
            btn: '▶ Gutscheine aktivieren',
            stop: '⏹ Stopp',
            notFound: '❌ Keine nicht aktivierten Gutscheine gefunden',
            done: (c, t) => `✅ Fertig! ${c} von ${t} Gutscheinen aktiviert.`,
            stopped: (c, t) => `⏹ Gestoppt. ${c} von ${t} Gutscheinen aktiviert.`,
            found: (n) => `🔍 ${n} Gutscheine gefunden.`,
            activated: (i) => `✅ Gutschein #${i} aktiviert`,
            progress: (c, t) => `⏳ ${c}/${t} – Klick zum Stoppen`,
            switchLabel: '🌐 Sprache:',
        },
        ru: {
            btn: '▶ Активировать купоны',
            stop: '⏹ Стоп',
            notFound: '❌ Не найдены неактивированные купоны',
            done: (c, t) => `✅ Готово! Активировано ${c}/${t} купонов.`,
            stopped: (c, t) => `⏹ Остановлено. Активировано ${c}/${t} купонов.`,
            found: (n) => `🔍 Найдено купонов: ${n}`,
            activated: (i) => `✅ Активирован купон #${i}`,
            progress: (c, t) => `⏳ ${c}/${t} – нажмите для остановки`,
            switchLabel: '🌐 Язык:',
        }
    };

    function getT() {
        return TEXTS[lang] || TEXTS.en;
    }

    let T = getT();

    function setLanguage(newLang) {
        lang = newLang;
        localStorage.setItem('pb_lang', newLang);
        T = getT();
        updateButtonText();
        showMessage(`${T.switchLabel} ${newLang.toUpperCase()}`);
    }

    // ---------- Activation ----------

    const COUPON_SELECTOR =
        '[data-testid="not-activated-coupons-section"] button[data-testid$="-not_activated"]';

    let running = false;
    let stopRequested = false;

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const randomDelay = () =>
        CLICK_DELAY_MIN + Math.random() * (CLICK_DELAY_MAX - CLICK_DELAY_MIN);

    // Buttons that were already clicked are remembered, so a coupon whose button
    // does not disappear after activation is not clicked twice.
    const clickedButtons = new WeakSet();

    function findPendingButtons() {
        return Array.from(document.querySelectorAll(COUPON_SELECTOR))
            .filter((btn) => btn.isConnected && !clickedButtons.has(btn));
    }

    async function activateCoupons() {
        if (running) {
            stopRequested = true;
            setButtonText(T.stop);
            return;
        }

        const total = findPendingButtons().length;
        if (total === 0) {
            showMessage(T.notFound);
            console.warn(T.notFound);
            return;
        }

        running = true;
        stopRequested = false;
        let clicked = 0;

        console.log(T.found(total));

        // Re-read the page before every click: after activation Payback re-renders the list.
        while (!stopRequested && clicked < total) {
            const btn = findPendingButtons()[0];
            if (!btn) break;
            clickedButtons.add(btn);
            btn.click();
            clicked++;
            console.log(T.activated(clicked));
            setButtonText(T.progress(clicked, total));
            await sleep(randomDelay());
        }

        const result = stopRequested ? T.stopped(clicked, total) : T.done(clicked, total);
        console.log(result);
        showMessage(result, 4000);

        running = false;
        stopRequested = false;
        updateButtonText();
    }

    // ---------- UI ----------

    function showMessage(text, duration = 1500) {
        const msg = document.createElement('div');
        msg.textContent = text;
        Object.assign(msg.style, {
            position: 'fixed',
            bottom: '120px',
            right: '20px',
            padding: '10px 20px',
            background: '#4caf50',
            color: 'white',
            fontSize: '16px',
            borderRadius: '8px',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'opacity 0.3s',
        });
        document.body.appendChild(msg);
        setTimeout(() => msg.style.opacity = '0', duration - 500);
        setTimeout(() => msg.remove(), duration);
    }

    function setButtonText(text) {
        const btn = document.getElementById('pb-activate-btn');
        if (btn) btn.textContent = text;
    }

    function addControlButton() {
        const btn = document.createElement('button');
        btn.id = 'pb-activate-btn';
        btn.textContent = T.btn;
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 15px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        });
        btn.addEventListener('click', activateCoupons);
        document.body.appendChild(btn);
    }

    function updateButtonText() {
        if (!running) setButtonText(T.btn);
        label.textContent = T.switchLabel;
    }

    let label;

    function addLanguageSwitcher() {
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            display: 'flex',
            gap: '5px',
            background: 'rgba(255,255,255,0.9)',
            padding: '6px 8px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            zIndex: 9999,
            alignItems: 'center',
        });

        label = document.createElement('span');
        label.textContent = T.switchLabel;
        label.style.fontSize = '12px';
        label.style.marginRight = '4px';

        const makeBtn = (text, title, onClick) => {
            const b = document.createElement('button');
            b.textContent = text;
            b.style.fontSize = '16px';
            b.style.border = 'none';
            b.style.background = 'transparent';
            b.style.cursor = 'pointer';
            b.title = title;
            b.addEventListener('click', onClick);
            return b;
        };

        container.append(
            label,
            makeBtn('🇬🇧', 'EN', () => setLanguage('en')),
            makeBtn('🇩🇪', 'DE', () => setLanguage('de')),
            makeBtn('🇷🇺', 'RU', () => setLanguage('ru'))
        );

        document.body.appendChild(container);
    }

    addControlButton();
    addLanguageSwitcher();
})();
