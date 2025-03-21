document.addEventListener("DOMContentLoaded", function() {
    // Check if SVG exists
    const svgElement = document.getElementById("contour-svg");
    if (!svgElement) return;

    // Check if we're on the homepage
    const isHomePage = window.location.pathname === '/' ||
        window.location.pathname === '/index.html' ||
        window.location.href.endsWith('/');

    // Track if animation has been run in this session
    const animationRun = sessionStorage.getItem('svgAnimationRun');
    const shouldRunAnimation = isHomePage || !animationRun;

    // Find all contour elements
    const contourElements = svgElement.querySelectorAll(".contour, [id^='C'], [id^='D']");
    if (contourElements.length === 0) return;

    // Convert to array and calculate max level
    const contours = Array.from(contourElements);
    let maxLevel = 0;

    // Process contours: extract levels and store original transforms
    contours.forEach(contour => {
        // Extract level from ID (e.g., C1, D36)
        const id = contour.getAttribute('id') || '';
        let level = 0;

        if (id.startsWith('C') || id.startsWith('D')) {
            level = parseInt(id.substring(1), 10) || 0;
        }

        // Store the level and original transform as data attributes
        contour.dataset.level = level;
        contour.dataset.originalTransform = contour.getAttribute('transform') || '';

        // Update max level
        maxLevel = Math.max(maxLevel, level);
    });

    // Run initial drawing animation if on homepage for first time
    if (shouldRunAnimation) {
        sessionStorage.setItem('svgAnimationRun', 'true');
        runDrawingAnimation(contours);

        // Set up scroll parallax after drawing animation completes
        setTimeout(() => {
            setupScrollParallax(contours, maxLevel);
        }, 4000);
    } else {
        // Skip animation and go straight to parallax
        setupScrollParallax(contours, maxLevel);
    }

    function runDrawingAnimation(contours) {
        // Sort contours by level (smaller numbers first)
        const sortedContours = [...contours].sort((a, b) => {
            const levelA = parseInt(a.dataset.level, 10) || 0;
            const levelB = parseInt(b.dataset.level, 10) || 0;
            return levelA - levelB;
        });

        // Apply animation with staggered delays
        sortedContours.forEach((contour, index) => {
            // Reset animation state first
            contour.style.animation = "none";
            void contour.offsetWidth; // Force reflow

            // Calculate delay based on group position
            const groupSize = 5;
            const groupIndex = Math.floor(index / groupSize);
            const delay = 0.2 * groupIndex;

            // Apply animation with delay
            contour.style.strokeDashoffset = "7000";
            contour.style.animation = `initialDraw 4s forwards ease-in-out ${delay}s`;
        });
    }

    function setupScrollParallax(contours, maxLevel) {
        // Clear any active animations
        contours.forEach(contour => {
            contour.style.animation = "none";
            contour.style.strokeDashoffset = "0"; // Keep lines visible
        });

        // Handle scroll events
        function handleScroll() {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            // Calculate scroll ratio (0 to 1)
            const scrollRatio = Math.min(1, Math.max(0, (scrollY / viewportHeight) * 2));

            // Apply parallax effect based on level
            contours.forEach(contour => {
                const level = parseInt(contour.dataset.level, 10) || 0;

                // Calculate movement amount based on level
                let movementAmount;
                if (level <= 1) {
                    movementAmount = 120; // Maximum movement
                } else if (level <= 6) {
                    movementAmount = 120 - ((level - 1) * (60 / 5)); // 120 to 60
                } else {
                    const remainingLevels = maxLevel - 6;
                    const positionInRemaining = level - 6;
                    const ratio = remainingLevels > 0 ? positionInRemaining / remainingLevels : 0;
                    movementAmount = 60 - (ratio * 50); // 60 to 10
                }

                // Apply parallax transformation
                const yOffset = -movementAmount * scrollRatio;
                const originalTransform = contour.dataset.originalTransform || '';

                if (originalTransform) {
                    contour.setAttribute('transform', `${originalTransform} translate(0,${yOffset})`);
                } else {
                    contour.setAttribute('transform', `translate(0,${yOffset})`);
                }
            });
        }

        // Add scroll listener and initialize
        window.addEventListener("scroll", handleScroll);
        handleScroll();
    }
});