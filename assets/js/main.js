/**
 * main.js – Template loader & component initializer
 * Loads HTML templates from components/ folder and initializes interactive features
 */

import { initHeader } from './header.js';

// Pricing cards – click to activate
function initPricingCards() {
    const cards = document.querySelectorAll('.pricing-card');
    if (!cards.length) return;

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            cards.forEach((c) => c.classList.remove('pricing-card--active'));
            card.classList.add('pricing-card--active');
        });
    });
}

// ── Buffer-style mouse parallax cho .tile-container ──────────────────────────
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
        this.el.style.transform = `translate3d(${this.x.toFixed(2)}px,${this.y.toFixed(2)}px,0)`;
        requestAnimationFrame(() => this._loop());
    }
}

function initParallax() {
    document.querySelectorAll('.tile-container').forEach(el => new AnimatedTile(el));
    console.log('✓ Parallax initialized');
}

// ── Stats Counting Animation ──────────────────────────────────────────────────
function initCounter() {
    const counters = document.querySelectorAll('.stat-item__number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetEl = entry.target;
                const targetValue = +targetEl.getAttribute('data-target');
                let count = 0;
                const speed = 40; // adjusting speed
                const inc = targetValue / speed;

                const updateCount = () => {
                    count += inc;
                    if (count < targetValue) {
                        targetEl.innerText = Math.ceil(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        targetEl.innerText = targetValue;
                    }
                };

                updateCount();
                obs.unobserve(targetEl);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
    console.log('✓ Counter initialized');
}

// Template loading function
async function loadTemplate(templateName, templateDefName) {
    try {
        const response = await fetch(`components/${templateName}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load ${templateName}: ${response.status}`);
        }

        const htmlContent = await response.text();

        // Extract content between {{ define "..." }} and {{ end }}
        const defineMatch = htmlContent.match(/\{\{\s*define\s+["']([^"']+)["']\s*\}\}([\s\S]*?)\{\{\s*end\s*\}\}/);

        if (defineMatch) {
            const content = defineMatch[2].trim();
            const defineName = defineMatch[1];

            // Find and replace template placeholder in body HTML
            const bodyHTML = document.body.innerHTML;
            const regex = new RegExp(`<!--[^>]*-->\\s*\\{\\{\\s*template\\s+["']${defineName}["']\\s*\\}\\}`, 'g');
            const newHTML = bodyHTML.replace(regex, content);

            if (bodyHTML !== newHTML) {
                document.body.innerHTML = newHTML;
                console.log(`✓ Loaded template: ${templateName}`);
            } else {
                console.warn(`Template call not found for: ${defineName}`);
            }
        } else {
            console.warn(`Template definition not found in ${templateName}.html`);
        }
    } catch (error) {
        console.error(`Error loading template ${templateName}:`, error);
    }
}

// Load SVG icons
async function loadSvgSprite() {
    try {
        const response = await fetch('components/icons.html');
        if (!response.ok) return;

        const svgContent = await response.text();
        const spriteContainer = document.getElementById('svg-sprite');

        if (spriteContainer) {
            spriteContainer.innerHTML = svgContent;
            console.log('✓ Loaded SVG sprites');
        }
    } catch (error) {
        console.error('Error loading SVG sprite:', error);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Starting template loader...');

    // Load SVG sprite first
    await loadSvgSprite();

    // Load templates in order
    await loadTemplate('header', 'section-header');
    await loadTemplate('hero', 'section-hero');
    await loadTemplate('services', 'section-website');

    // Initialize interactive components after templates are loaded
    setTimeout(() => {
        initHeader();
        initPricingCards();
        initParallax();
        initCounter();
        console.log('✓ Components initialized');
    }, 100);
});