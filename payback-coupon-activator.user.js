// ==UserScript==
// @name            Payback Batch Activate Coupons
// @name:en         Payback Batch Activate Coupons
// @name:ru         Payback активировать все купоны (пакетами)
// @name:de         Payback Gutscheine in Paketen aktivieren
// @namespace       https://github.com/jake-double-one/payback-coupon-activator
// @version         2.1.0
// @description:ru  Кнопка на странице для активации всех купонов пакетами с паузами
// @description:de  Schaltfläche zur Aktivierung aller Gutscheine in Paketen mit Pausen
// @description:en  Button on the page for activating all coupons in batches with pauses
// @description     Button on the page for activating all coupons in batches with pauses
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
- Coupons are activated in batches (default: 50) instead of all at once.
- Short random delay between single clicks and a pause between batches,
  so Payback does not soft-block the account for too many requests.
- The button shows live progress and can be clicked again to stop.
- Batch size and delays can be changed via the ⚙ button (stored in localStorage).
*/

(function () {
    'use strict';

    // ---------- Settings ----------

    const DEFAULTS = {
        batchSize: 50,     // coupons per batch
        clickDelayMin: 250, // ms between single clicks (min)
        clickDelayMax: 600, // ms between single clicks (max)
        batchPause: 8000,   // ms pause between batches
    };

    function loadSettings() {
        try {
            return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('pb_settings') || '{}') };
        } catch (e) {
            return { ...DEFAULTS };
        }
    }

    let settings = loadSettings();

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
            pause: (s, c, t) => `⏸ Pause ${s}s (${c}/${t})`,
            batch: (b, n) => `📦 Batch ${b}: ${n} coupons`,
            switchLabel: '🌐 Language:',
            askBatch: 'Coupons per batch:',
            askPause: 'Pause between batches (seconds):',
            saved: '💾 Settings saved',
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
            pause: (s, c, t) => `⏸ Pause ${s}s (${c}/${t})`,
            batch: (b, n) => `📦 Paket ${b}: ${n} Gutscheine`,
            switchLabel: '🌐 Sprache:',
            askBatch: 'Gutscheine pro Paket:',
            askPause: 'Pause zwischen Paketen (Sekunden):',
            saved: '💾 Einstellungen gespeichert',
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
            pause: (s, c, t) => `⏸ Пауза ${s}с (${c}/${t})`,
            batch: (b, n) => `📦 Пакет ${b}: ${n} купонов`,
            switchLabel: '🌐 Язык:',
            askBatch: 'Купонов в пакете:',
            askPause: 'Пауза между пакетами (секунды):',
            saved: '💾 Настройки сохранены',
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
        settings.clickDelayMin + Math.random() * (settings.clickDelayMax - settings.clickDelayMin);

    // Buttons that were already clicked are remembered, so a coupon whose button
    // does not disappear after activation is not clicked twice.
    const clickedButtons = new WeakSet();

    function findPendingButtons() {
        return Array.from(document.querySelectorAll(COUPON_SELECTOR))
            .filter((btn) => btn.isConnected && !clickedButtons.has(btn));
    }

    async function pause(ms, clicked, total) {
        const end = Date.now() + ms;
        while (!stopRequested && Date.now() < end) {
            setButtonText(T.pause(Math.ceil((end - Date.now()) / 1000), clicked, total));
            await sleep(Math.min(250, end - Date.now()));
        }
    }

    async function activateCoupons() {
        if (running) {
            stopRequested = true;
            setButtonText(T.stop);
            return;
        }

        let pending = findPendingButtons();
        if (pending.length === 0) {
            showMessage(T.notFound);
            console.warn(T.notFound);
            return;
        }

        running = true;
        stopRequested = false;
        const total = pending.length;
        let clicked = 0;
        let batchNo = 0;

        console.log(T.found(total));

        while (!stopRequested && pending.length > 0 && clicked < total) {
            batchNo++;
            const batch = pending.slice(0, Math.min(settings.batchSize, total - clicked));
            console.log(T.batch(batchNo, batch.length));

            for (const btn of batch) {
                if (stopRequested) break;
                if (!btn.isConnected) continue;
                clickedButtons.add(btn);
                btn.click();
                clicked++;
                console.log(T.activated(clicked));
                setButtonText(T.progress(clicked, total));
                await sleep(randomDelay());
            }

            // Re-read the page: after activation Payback re-renders the list.
            pending = findPendingButtons();
            if (!stopRequested && pending.length > 0 && clicked < total) {
                await pause(settings.batchPause, clicked, total);
                pending = findPendingButtons();
            }
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

    function openSettings() {
        const size = parseInt(prompt(T.askBatch, settings.batchSize), 10);
        if (Number.isNaN(size)) return;
        const pauseSec = parseFloat(prompt(T.askPause, settings.batchPause / 1000));
        if (Number.isNaN(pauseSec)) return;

        settings.batchSize = Math.max(1, size);
        settings.batchPause = Math.max(0, pauseSec * 1000);
        localStorage.setItem('pb_settings', JSON.stringify({
            batchSize: settings.batchSize,
            batchPause: settings.batchPause,
        }));
        showMessage(T.saved);
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
            makeBtn('🇷🇺', 'RU', () => setLanguage('ru')),
            makeBtn('⚙', 'Settings', openSettings)
        );

        document.body.appendChild(container);
    }

    addControlButton();
    addLanguageSwitcher();
})();
