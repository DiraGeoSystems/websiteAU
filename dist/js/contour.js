// Clean SVG animation solution with adjusted parameters
document.addEventListener("DOMContentLoaded", function() {
    const svgContainer = document.getElementById("dira");
    const svgImage = document.querySelector("#dira img");
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

            setupAnimation();
        })
        .catch(error => {
            console.error("Error loading SVG:", error);
        });

    function setupAnimation() {
        const svg = document.getElementById("contour-svg");
        let contourLines = svg.querySelectorAll(".contour");

        // If no contour lines are found, add the class to all paths
        if (contourLines.length === 0) {
            const paths = svg.querySelectorAll("path");
            paths.forEach(path => {
                path.classList.add("contour");
            });
            contourLines = svg.querySelectorAll(".contour");
        }

        const allContours = Array.from(contourLines);

        // PHASE 1: Initial Drawing Animation - ADJUSTED TO 4s
        allContours.forEach((contour, index) => {
            contour.style.fill = "none";
            contour.style.strokeDasharray = "7000";
            contour.style.strokeDashoffset = "7000";
            contour.style.transition = "none";

            void contour.offsetWidth;

            const groupIndex = Math.floor(index / 10);
            const delay = 0.2 * (groupIndex + 1);

            // ANIMATION DURATION REDUCED TO 4s
            contour.style.animation = `initialDraw 4s forwards ease-in-out ${delay}s`;
        });

        // PHASE 2: Switch to scroll-based animation after initial drawing completes
        setTimeout(() => {
            allContours.forEach((contour) => {
                contour.style.animation = "none";

                // SCROLL ANIMATION SPEED - ADJUST THE 0.1s VALUE TO CHANGE RESPONSIVENESS
                contour.style.transition = "stroke-dashoffset 0.05s linear";

                contour.style.strokeDashoffset = "0";
            });

            setupScrollHandler(allContours);

        }, 4500); // Adjusted timing for 4s animation + delays

        function setupScrollHandler(contours) {
            function handleScroll() {
                const section = document.getElementById("dira");
                const rect = section.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                // SCROLL TRIGGER POINT CALCULATION
                // Adjust the formula below to change when and how fast the animation responds to scrolling
                // 1 - ((rect.top + rect.height / 2) / (viewportHeight + rect.height / 2))
                // This calculates a value from 0 (when section enters viewport) to 1 (when it leaves viewport)

                // You can adjust the thresholds by modifying this formula
                // For example, to start the animation sooner, you could use:
                // const positionFactor = Math.max(0, Math.min(1, 1 - ((rect.top + rect.height * 0.7) / (viewportHeight + rect.height * 0.7))));

                const positionFactor = Math.max(0, Math.min(1,
                    1 - ((rect.top + rect.height * 0.9) / (viewportHeight + rect.height * 0.9))
                ));

                const progress = positionFactor;

                // Apply the animation to each contour with staggered effect
                contours.forEach((contour, index) => {
                    const groupIndex = Math.floor(index / 10);
                    // STAGGER AMOUNT - Adjust 0.05 to change how staggered the effect is
                    const delayFactor = 0.005 * groupIndex;

                    const adjustedProgress = Math.max(0, Math.min(1, progress - delayFactor));
                    // ADJUSTED TO 5000 to match the new dasharray value
                    const dashOffset = adjustedProgress * 7000;

                    contour.style.strokeDashoffset = dashOffset.toString();
                });
            }

            window.addEventListener("scroll", handleScroll);
            handleScroll();
        }
    }
});