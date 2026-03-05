/**
 * header.js – Sticky navbar interactions
 * Handles: scroll → glassmorphism, mobile toggle, dropdown, backdrop
 */

export function initHeader() {
    const header = document.getElementById('main-header');
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('menu-backdrop');

    if (!header) return;

    // ── Scroll effect (transparent → glass) ──────────────────────
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    // ── Mobile menu helpers ───────────────────────────────────────
    function openMobileMenu() {
        hamburger.classList.add('open');
        mobileMenu.classList.add('open');
        backdrop && backdrop.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        backdrop && backdrop.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // ── Mobile menu toggle ────────────────────────────────────────
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.contains('open');
            isOpen ? closeMobileMenu() : openMobileMenu();
        });

        // Close when any mobile link is tapped
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close on backdrop click
        if (backdrop) {
            backdrop.addEventListener('click', closeMobileMenu);
        }

        // Close on ESC key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeMobileMenu();
        });

        // Auto-close when resizing back to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                closeMobileMenu();
            }
        }, { passive: true });
    }
}
