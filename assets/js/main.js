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
            // Support both {{template "..."}} and {{ template "..." }}
            const bodyHTML = document.body.innerHTML;
            const regex = new RegExp(`<!--[^>]*-->\s*\{\{\s*template\s+["']${defineName}["']\s*\}\}`, 'g');
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
        console.log('✓ Components initialized');
    }, 100); // Small delay to ensure DOM is updated
});