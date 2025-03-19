// JavaScript for progressive scroll-based SVG animation
document.addEventListener("DOMContentLoaded", function() {
    const svgContainer = document.getElementById("dira");
    const svgImage = document.querySelector("#dira img");
    const svgUrl = svgImage.getAttribute("src");

    // Fetch the SVG file
    fetch(svgUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.text();
        })
        .then(svgContent => {
            // Create a DOM parser to parse the SVG content
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
            const svgElement = svgDoc.documentElement;

            // Add id to the SVG element
            svgElement.id = "contour-svg";

            // Replace the image with the inline SVG
            svgImage.parentNode.replaceChild(svgElement, svgImage);

            // Now set up the scroll animation since the SVG is now inline
            setupScrollAnimation();
        })
        .catch(error => {
            console.error("Error loading SVG:", error);
        });

    function setupScrollAnimation() {
        const svg = document.getElementById("contour-svg");
        const contourLines = svg.querySelectorAll(".contour");

        console.log(`Found ${contourLines.length} contour lines`);

        // If no contour lines are found, you might need to add the class
        if (contourLines.length === 0) {
            const paths = svg.querySelectorAll("path");
            paths.forEach(path => {
                path.classList.add("contour");
            });
            console.log(`Added 'contour' class to ${paths.length} path elements`);
        }

        const allContours = svg.querySelectorAll(".contour");

        // Set up initial drawing animation through CSS
        allContours.forEach((contour, index) => {
            contour.style.fill = "none";
            contour.style.strokeDasharray = "5000";

            // Initial animation will be handled by CSS, but ensure it's properly set
            contour.style.animation = "none"; // Reset any existing animations

            // Set transition for smooth scroll-based animations later
            contour.style.transition = "none"; // Will be updated after initial animation

            // Apply the CSS class for initial animation
            contour.classList.add("initial-draw");

            // Staggered delays based on index
            const groupIndex = Math.floor(index / 10);
            const delay = 0.2 * (groupIndex + 1);
            contour.style.animationDelay = `${delay}s`;
        });

        // After initial animation completes, set up for scroll-based animation
        setTimeout(() => {
            allContours.forEach((contour, index) => {
                // Remove initial animation
                contour.classList.remove("initial-draw");

                // Prepare for scroll-based animation
                contour.style.transition = "stroke-dashoffset 0.1s linear";

                // Start with fully drawn lines (strokeDashoffset = 0)
                contour.style.strokeDashoffset = "0";
            });

            // Now enable the scroll-based animation
            window.addEventListener("scroll", handleScroll);
            // Initial check
            handleScroll();
        }, 5000); // Wait for initial animation to complete (8s animation + 1s buffer)

        function handleScroll() {
            const section = document.getElementById("dira");
            const rect = section.getBoundingClientRect();

            // Calculate how much of the section has been scrolled
            // When section is at top of viewport, progress = 0 (fully drawn)
            // When section is scrolled away, progress = 1 (fully erased)
            const sectionHeight = section.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Calculate scroll progress (0 to 1)
            let scrollProgress = 0;

            // If section is below viewport
            if (rect.top >= viewportHeight) {
                scrollProgress = 0; // Not scrolled yet, fully drawn
            }
            // If section is above viewport
            else if (rect.bottom <= 0) {
                scrollProgress = 1; // Fully scrolled past, fully erased
            }
            // If section is partially in viewport
            else {
                // Calculate based on how much of section has moved past top of viewport
                // This creates a smooth transition as user scrolls through the section
                scrollProgress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight / 2)));
            }

            console.log(`Scroll progress: ${scrollProgress.toFixed(2)}, Top: ${rect.top.toFixed(0)}, Bottom: ${rect.bottom.toFixed(0)}`);

            // Apply the scroll progress to each contour line
            // When progress is 0, lines are fully drawn (strokeDashoffset = 0)
            // When progress is 1, lines are fully erased (strokeDashoffset = 10000)
            allContours.forEach((contour, index) => {
                // Add slight delay based on index for staggered effect
                const groupIndex = Math.floor(index / 10);
                const delayFactor = 0.05 * groupIndex;

                // Adjust progress for this specific contour to create staggered effect
                // Earlier contours respond sooner to scrolling
                const adjustedProgress = Math.max(0, Math.min(1, scrollProgress - delayFactor));

                // Map progress (0-1) to strokeDashoffset (0-10000)
                const dashOffset = adjustedProgress * 8000;
                contour.style.strokeDashoffset = dashOffset.toString();
            });
        }
    }
});