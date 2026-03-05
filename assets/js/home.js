/**
 * home.js – Home page–specific JS (index.html only)
 * Requires: main.js loaded first (handles header + scroll-to-top)
 * Usage:
 *   <script src="assets/js/main.js"></script>
 *   <script type="module" src="assets/js/home.js"></script>
 */

// ────────────────────────────────────────────────────────────────
// Pricing cards – click to activate
// ────────────────────────────────────────────────────────────────
function initPricingCards() {
    const cards = document.querySelectorAll('.pricing-card');
    if (!cards.length) return;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('pricing-card--active'));
            card.classList.add('pricing-card--active');
        });
    });

    console.log('✓ Pricing cards initialized');
}

// ────────────────────────────────────────────────────────────────
// Buffer-style mouse parallax for .tile-container
// ────────────────────────────────────────────────────────────────
const PARALLAX_SPRING = 0.08;
const PARALLAX_DAMPING = 0.75;

class AnimatedTile {
    constructor(el) {
        this.el = el;
        this.maxOffset = parseFloat(el.dataset.max || 35);
        this.radius = parseFloat(el.dataset.radius || 400);
        this.x = 0; this.y = 0;
        this.tx = 0; this.ty = 0;
        this.vx = 0; this.vy = 0;

        this._onMouseMove = this._onMouseMove.bind(this);
        window.addEventListener('mousemove', this._onMouseMove, { passive: true });
        requestAnimationFrame(() => this._loop());
    }

    _onMouseMove(e) {
        const rect = this.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < this.radius) {
            const ratio = dist <= this.maxOffset ? 1 : this.maxOffset / dist;
            this.tx = dx * ratio;
            this.ty = dy * ratio;
        } else {
            this.tx = 0;
            this.ty = 0;
        }
    }

    _loop() {
        this.vx += (this.tx - this.x) * PARALLAX_SPRING;
        this.vy += (this.ty - this.y) * PARALLAX_SPRING;
        this.vx *= PARALLAX_DAMPING;
        this.vy *= PARALLAX_DAMPING;
        this.x += this.vx;
        this.y += this.vy;
        this.el.style.transform =
            `translate3d(${this.x.toFixed(2)}px, ${this.y.toFixed(2)}px, 0)`;
        requestAnimationFrame(() => this._loop());
    }
}

function initParallax() {
    const tiles = document.querySelectorAll('.tile-container');
    if (!tiles.length) return;
    tiles.forEach(el => new AnimatedTile(el));
    console.log('✓ Parallax initialized');
}

// ────────────────────────────────────────────────────────────────
// Stats counting animation (IntersectionObserver)
// ────────────────────────────────────────────────────────────────
function initCounter() {
    const counters = document.querySelectorAll('.stat-item__number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const targetValue = +el.getAttribute('data-target');
            let count = 0;
            const inc = targetValue / 40;

            const tick = () => {
                count += inc;
                if (count < targetValue) {
                    el.innerText = Math.ceil(count);
                    requestAnimationFrame(tick);
                } else {
                    el.innerText = targetValue;
                }
            };
            tick();
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
    console.log('✓ Counter initialized');
}

// ────────────────────────────────────────────────────────────────
// SVG Sprite loader
// ────────────────────────────────────────────────────────────────
async function loadSvgSprite() {
    try {
        const res = await fetch('components/icons.html');
        if (!res.ok) return;
        const container = document.getElementById('svg-sprite');
        if (container) {
            container.innerHTML = await res.text();
            console.log('✓ SVG sprites loaded');
        }
    } catch (err) {
        console.error('Error loading SVG sprite:', err);
    }
}

// ────────────────────────────────────────────────────────────────
// Template loader (Go-template style {{ define / template }})
// ────────────────────────────────────────────────────────────────
async function loadTemplate(templateName) {
    try {
        const res = await fetch(`components/${templateName}.html`);
        if (!res.ok) throw new Error(`${templateName}: ${res.status}`);

        const html = await res.text();
        const match = html.match(
            /\{\{\s*define\s+["']([^"']+)["']\s*\}\}([\s\S]*?)\{\{\s*end\s*\}\}/
        );
        if (!match) {
            console.warn(`Template definition not found in ${templateName}.html`);
            return;
        }

        const [, defineName, content] = match;
        const bodyHTML = document.body.innerHTML;
        const regex = new RegExp(
            `<!--[^>]*-->\\s*\\{\\{\\s*template\\s+["']${defineName}["']\\s*\\}\\}`, 'g'
        );
        const newHTML = bodyHTML.replace(regex, content.trim());

        if (bodyHTML !== newHTML) {
            document.body.innerHTML = newHTML;
            console.log(`✓ Template loaded: ${templateName}`);
        } else {
            console.warn(`Template call not found for: ${defineName}`);
        }
    } catch (err) {
        console.error(`Error loading template ${templateName}:`, err);
    }
}

// ────────────────────────────────────────────────────────────────
// Boot sequence for Home page
// ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Home page initializing…');

    await loadSvgSprite();

    // Load section templates (if using Go-template approach)
    await loadTemplate('header');
    await loadTemplate('hero');
    await loadTemplate('services');

    // Init home-specific components (after templates load)
    setTimeout(() => {
        initPricingCards();
        initParallax();
        initCounter();
        console.log('✓ Home page ready');
    }, 100);
});
