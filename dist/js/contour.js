document.addEventListener("DOMContentLoaded", function() {
    const svgContainer = document.getElementById("background");

    // Exit early if container doesn't exist
    if (!svgContainer) return;

    const svgImage = document.querySelector("#background img, #background #contour-svg");

    // Exit early if there's no SVG image
    if (!svgImage) return;

    const svgUrl = svgImage.getAttribute("src");

    // Add the keyframes dynamically
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
    @keyframes initialDraw {
      from { stroke-dashoffset: 7000; }
      to { stroke-dashoffset: 0; }
    }
  `;
    document.head.appendChild(styleSheet);

    // Fetch the SVG file
    fetch(svgUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.text();
        })
        .then(svgContent => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
            const svgElement = svgDoc.documentElement;

            svgElement.id = "contour-svg";
            svgImage.parentNode.replaceChild(svgElement, svgImage);

            if (svgElement) {
                // Make sure the SVG has a viewBox
                if (!svgElement.getAttribute('viewBox')) {
                    const width = svgElement.getAttribute('width') || 100;
                    const height = svgElement.getAttribute('height') || 100;
                    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
                }

                // Set width and height to 100%
                svgElement.setAttribute('width', '100%');
                svgElement.setAttribute('height', '100%');

                // Set preserveAspectRatio to cover the area
                svgElement.setAttribute('preserveAspectRatio', 'xMidYMid slice');
            }

            // Check if there are any contour elements before proceeding
            const contourElements = svgElement.querySelectorAll(".contour, [id^='C'], [id^='D']");
            if (contourElements.length === 0) {
                console.log("No contour elements found, aborting animation setup");
                return;
            }

            setupAnimation();
        })
        .catch(error => {
            console.error("Error loading SVG:", error);
        });

    function setupAnimation() {
        const svg = document.getElementById("contour-svg");
        if (!svg) return;

        // Select contours by both class and ID pattern
        let contourLines = svg.querySelectorAll(".contour, [id^='C'], [id^='D']");

        // If no contour lines are found, abort
        if (contourLines.length === 0) {
            console.log("No contour lines found after replacement");
            return;
        }

        const allContours = Array.from(contourLines);

        // Store original positions
        allContours.forEach(contour => {
            // Extract contour level from ID (e.g., C1, D36)
            const id = contour.getAttribute('id') || '';
            let level = 0;

            if (id.startsWith('C') || id.startsWith('D')) {
                level = parseInt(id.substring(1), 10) || 0;
            }

            // Store the level as a data attribute for easy access
            contour.dataset.level = level;

            // Store original transform or create one if it doesn't exist
            const originalTransform = contour.getAttribute('transform') || '';
            contour.dataset.originalTransform = originalTransform;

            // Set up for the drawing animation
            contour.style.fill = "none";
            contour.style.strokeDasharray = "7000";
            contour.style.strokeDashoffset = "7000";
            contour.style.transition = "none";
        });

        // Initial drawing animation
        allContours.forEach((contour, index) => {
            void contour.offsetWidth;

            const groupIndex = Math.floor(index / 10);
            const delay = 0.2 * (groupIndex + 1);

            contour.style.animation = `initialDraw 6s forwards ease-in-out ${delay}s`;
        });

        // Switch to scroll-based animation after initial drawing completes
        setTimeout(() => {
            allContours.forEach((contour) => {
                contour.style.animation = "none";
                contour.style.transition = "transform 0.05s linear";
                contour.style.strokeDashoffset = "0"; // Keep lines fully drawn
            });

            // Set up just the parallax (no undrawing)
            setupScrollHandler(allContours);

        }, 6000); // Wait for initial drawing animation to complete

        function setupScrollHandler(contours) {
            // Calculate max level for normalization
            let maxLevel = 0;
            contours.forEach(contour => {
                const level = parseInt(contour.dataset.level, 10) || 0;
                maxLevel = Math.max(maxLevel, level);
            });

            function handleScroll() {
                const section = document.getElementById("background");
                if (!section) return;

                // For fixed backgrounds, use the window's scroll position instead of element position
                const scrollY = window.scrollY;
                const viewportHeight = window.innerHeight;

                // Calculate how far down the page we've scrolled, as a ratio of viewport height
                // Multiply by a factor to make the effect complete after ~2 scroll actions
                const scrollRatio = (scrollY / viewportHeight) * 2;

                // Clamp between 0 and 1
                const positionFactor = Math.max(0, Math.min(1, scrollRatio));

                // Apply parallax effect to all contours with staggered movement
                contours.forEach((contour) => {
                    const id = contour.getAttribute('id') || '';
                    const level = parseInt(contour.dataset.level, 10) || 0;

                    // Keep lines fully drawn
                    contour.style.strokeDashoffset = "0";

                    // Create a non-linear curve for movement amount
                    // First contour (level 1) moves the most
                    // Movement gradually decreases for higher numbered contours

                    let movementAmount;
                    if (level <= 1) {
                        // First contour gets maximum movement
                        movementAmount = 120;
                    } else if (level <= 6) {
                        // Contours 2-6 get gradually less movement
                        // First contour moves 2x the amount of the sixth contour
                        movementAmount = 120 - ((level - 1) * (60 / 5)); // Goes from 120 to 60
                    } else {
                        // All remaining contours gradually fade to 10px movement
                        // Calculate on a curve from 60px to 10px
                        const remainingLevels = maxLevel - 6;
                        const positionInRemaining = level - 6;
                        const ratio = remainingLevels > 0 ? positionInRemaining / remainingLevels : 0;
                        movementAmount = 60 - (ratio * 50); // 60px down to 10px
                    }

                    // Apply the parallax offset
                    const yOffset = -movementAmount * positionFactor;

                    // Apply the transform, preserving any original transform
                    const originalTransform = contour.dataset.originalTransform || '';

                    // Add the translation to any existing transform
                    if (originalTransform) {
                        contour.setAttribute('transform', `${originalTransform} translate(0,${yOffset})`);
                    } else {
                        contour.setAttribute('transform', `translate(0,${yOffset})`);
                    }
                });
            }

            window.addEventListener("scroll", handleScroll);
            handleScroll(); // Initial call to set positions
        }
    }
});