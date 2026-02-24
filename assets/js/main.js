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

// ─── Bootstrap ───────────────────────────────────────────────────
async function bootstrap() {
    // Load all components in parallel (preserving DOM order)
    await Promise.all(
        COMPONENTS.map(async ({ id, html, init }) => {
            const target = document.getElementById(id);
            if (!target) return;

            try {
                const res = await fetch(html);
                if (!res.ok) throw new Error(`Failed to load ${html}: ${res.status}`);
                target.innerHTML = await res.text();
                if (typeof init === 'function') init();
            } catch (err) {
                console.error(`[main.js] Error loading component "${id}":`, err);
            }
        })
    );
}

bootstrap();
