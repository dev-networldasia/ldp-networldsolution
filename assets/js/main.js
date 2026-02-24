/**
 * main.js – App entry point
 * Loads HTML components into their placeholder divs,
 * then initialises each section's JS module.
 *
 * Pattern: fetch() → innerHTML → init()
 * Add new sections here as they are built.
 */

import { initHeader } from './header.js';
import { initHero } from './hero.js';

// ─── Component registry ──────────────────────────────────────────
// { placeholder id in index.html → { html: path, init: fn } }
const COMPONENTS = [
    // SVG sprite – phải load trước tất cả component khác
    {
        id: 'svg-sprite',
        html: 'components/icons.html',
        init: null,
    },
    {
        id: 'section-header',
        html: 'components/header.html',
        init: initHeader,
    },
    {
        id: 'section-hero',
        html: 'components/hero.html',
        init: initHero,
    },
    // TODO: Add more sections below as they are built
    // { id: 'section-trusted',      html: 'components/trusted.html',      init: initTrusted },
    // { id: 'section-services',     html: 'components/services.html',     init: initServices },
    // { id: 'section-why-us',       html: 'components/why-us.html',       init: null },
    // { id: 'section-pricing',      html: 'components/pricing.html',      init: initPricing },
    // { id: 'section-testimonials', html: 'components/testimonials.html', init: null },
    // { id: 'section-cta',          html: 'components/cta.html',          init: null },
    // { id: 'section-footer',       html: 'components/footer.html',       init: null },
];

// ─── Helper: load một component vào DOM ──────────────────────────
async function loadComponent({ id, html, init }) {
    const target = document.getElementById(id);
    if (!target) {
        console.warn(`[main.js] ⚠️  #${id} không tìm thấy trong DOM`);
        return;
    }
    try {
        const res = await fetch(html);
        if (!res.ok) throw new Error(`${html} → ${res.status}`);
        const text = await res.text();

        // DOMParser tạo full document – reliable hơn innerHTML/template
        // cho SVG bên trong <a> (tránh HTML5 fragment-parser quirk)
        const doc = new DOMParser().parseFromString(text, 'text/html');

        // Array.from snapshot trước khi move (childNodes là live list)
        target.replaceChildren(...Array.from(doc.body.childNodes));

        const svgCount = target.querySelectorAll('svg').length;
        console.log(`[main.js] ✅ #${id}: ${target.childNodes.length} nodes | ${svgCount} SVG`);

        if (typeof init === 'function') init();
    } catch (err) {
        console.error(`[main.js] ❌ #${id}:`, err);
    }
}

// ─── Bootstrap ───────────────────────────────────────────────────
async function bootstrap() {
    // Phase 1 – SVG sprite phải có trong DOM TRƯỚC khi mọi section init
    //           (để <use href="#icon-id"> resolve đúng symbol)
    const [sprite, ...sections] = COMPONENTS;
    await loadComponent(sprite);
    console.log('[main.js] ✅ SVG sprite injected');

    // Phase 2 – Load tất cả sections song song (nhanh hơn, thứ tự DOM không đổi)
    await Promise.all(sections.map(loadComponent));
    console.log('[main.js] ✅ All components injected');
}

bootstrap();
