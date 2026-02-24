/**
 * header.js – Sticky navbar interactions
 * Handles: scroll → glassmorphism, mobile toggle, dropdown keyboard a11y
 */

export function initHeader() {
    const header = document.getElementById('main-header');
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!header) return;

    // ── Scroll effect (transparent → glass) ──────────────────────
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    // ── Mobile menu toggle ────────────────────────────────────────
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            mobileMenu.setAttribute('aria-hidden', String(!isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close when any mobile link is tapped
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close on outside click / ESC
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }

    function closeMobileMenu() {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}
