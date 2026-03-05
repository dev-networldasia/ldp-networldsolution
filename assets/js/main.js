/**
 * main.js – Shared JS for ALL pages
 * Usage (copy vào mọi trang):
 *   <script src="assets/js/main.js"></script>
 *
 * Bao gồm: header scroll glass, mobile menu, backdrop, scroll-to-top
 * Không cần type="module" – chạy được ngay mọi nơi
 */

(function () {
    'use strict';

    // ── Header: scroll glassmorphism + mobile menu + backdrop ────────
    function initHeader() {
        const header = document.getElementById('main-header');
        const hamburger = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const backdrop = document.getElementById('menu-backdrop');

        if (!header) return;

        const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        if (!hamburger || !mobileMenu) return;

        function openMenu() {
            hamburger.classList.add('open');
            mobileMenu.classList.add('open');
            backdrop && backdrop.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            backdrop && backdrop.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', () =>
            hamburger.classList.contains('open') ? closeMenu() : openMenu()
        );

        mobileMenu.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', closeMenu)
        );

        backdrop && backdrop.addEventListener('click', closeMenu);

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) closeMenu();
        }, { passive: true });
    }

    // ── Scroll-to-Top button ─────────────────────────────────────────
    function initScrollToTop() {
        const btn = document.getElementById('scrollToTop');
        if (!btn) return;

        window.addEventListener('scroll', () =>
            btn.classList.toggle('visible', window.scrollY > 300)
            , { passive: true });

        btn.addEventListener('click', () =>
            window.scrollTo({ top: 0, behavior: 'smooth' })
        );
    }

    // ── Boot ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        initHeader();
        initScrollToTop();
    });

})();