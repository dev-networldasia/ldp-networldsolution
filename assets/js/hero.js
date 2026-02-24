/**
 * hero.js – Hero section interactions
 * Handles: count-up animation for stat numbers (triggered on scroll)
 */

export function initHero() {
    animateCounters();
}

/**
 * Count-up animation for .hero__stat-value elements.
 * Attributes: data-count (target number), data-suffix (e.g. "+", "%"),
 *             data-sep="," (optional thousands separator)
 */
function animateCounters() {
    const counters = document.querySelectorAll('.hero__stat-value[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            countUp(entry.target);
        });
    }, { threshold: 0.6 });

    counters.forEach(el => observer.observe(el));
}

function countUp(el) {
    const end = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const useSep = el.dataset.sep === ',';
    const duration = 1600;
    const startTs = performance.now();

    function tick(now) {
        const elapsed = now - startTs;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = Math.floor(eased * end);
        const display = useSep ? value.toLocaleString('en-US') : value.toString();
        el.textContent = display + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}
