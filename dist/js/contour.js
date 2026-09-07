document.addEventListener("DOMContentLoaded", function() {
    // Check if SVG exists
    const svgElement = document.getElementById("contour-svg");
    if (!svgElement) return;

    // Check if we're on the homepage
    const isHomePage = window.location.pathname === '/' ||
        window.location.pathname === '/index.html' ||
        window.location.href.endsWith('/');

    // Track if the reveal has been run in this session
    const animationRun = sessionStorage.getItem('svgAnimationRun');
    const shouldRunAnimation = isHomePage || !animationRun;

    // Respect users who ask for less motion (OS-level setting)
    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const contours = Array.from(svgElement.querySelectorAll(".contour, [id^='C'], [id^='D']"));
    if (contours.length === 0) return;

    // Extract the elevation level from each ID (e.g. C1, D36) — used only to
    // order the staggered reveal from the lowest contours upward.
    contours.forEach(contour => {
        const id = contour.getAttribute('id') || '';
        let level = 0;
        if (id.startsWith('C') || id.startsWith('D')) {
            level = parseInt(id.substring(1), 10) || 0;
        }
        contour.dataset.level = level;
    });

    // Intro reveal (skipped for reduced motion; lines just start drawn)
    if (shouldRunAnimation && !prefersReducedMotion) {
        sessionStorage.setItem('svgAnimationRun', 'true');
        runDrawingAnimation(contours);
    } else {
        contours.forEach(contour => { contour.style.strokeDashoffset = "0"; });
    }

    // Parallax: move the whole SVG as one GPU-composited layer (reduced motion off)
    if (!prefersReducedMotion) {
        setupScrollParallax(svgElement);
    }

    function runDrawingAnimation(contours) {
        // Reveal from the lowest contours upward, staggered in groups of 5
        const sorted = [...contours].sort((a, b) =>
            (parseInt(a.dataset.level, 10) || 0) - (parseInt(b.dataset.level, 10) || 0));

        sorted.forEach((contour, index) => {
            contour.style.animation = "none";
            void contour.offsetWidth; // Force reflow

            const groupIndex = Math.floor(index / 5);
            const delay = 0.2 * groupIndex;

            contour.style.strokeDashoffset = "7000";
            contour.style.animation = `initialDraw 4s forwards ease-in-out ${delay}s`;
        });
    }

    function setupScrollParallax(el) {
        // The whole SVG drifts up at a fraction of the scroll distance, so the
        // background moves slower than the page content. Every contour moves by
        // the same amount, so lines never shift relative to each other.
        const FACTOR = 0.15;
        let lastOffset = null;
        let ticking = false;

        function update() {
            ticking = false;
            // Cap the drift so it can't exceed the #background buffer and expose
            // a gap at the bottom edge (see height in the SCSS). At FACTOR 0.15
            // this cap is reached at ~4 screens scrolled.
            const cap = window.innerHeight * 0.6;
            let drift = window.scrollY * FACTOR;
            if (drift > cap) drift = cap;

            const yOffset = -Math.round(drift);
            if (yOffset === lastOffset) return;
            lastOffset = yOffset;
            el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        }

        function requestUpdate() {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }

        window.addEventListener("scroll", requestUpdate, { passive: true });
        update(); // set initial position
    }
});
