class InfiniteScroller {
    constructor(containerId, wrapperId, direction, durationForOneFullScrollS) {
        this.container = document.getElementById(containerId);
        this.wrapperId = wrapperId;
        this.wrapper = document.getElementById(this.wrapperId);
        this.direction = direction; // 'left' or 'right'
        this.animationDuration = durationForOneFullScrollS * 1000; // Convert to milliseconds

        // Validate inputs
        if (!this.container) {
            throw new Error(`Container with ID '${containerId}' not found`);
        }
        if (!this.wrapper) {
            throw new Error(`Wrapper with ID '${this.wrapperId}' not found`);
        }
        if (!['left', 'right'].includes(this.direction)) {
            throw new Error("Direction must be 'left' or 'right'");
        }

        // Store original logos
        this.originalLogos = Array.from(this.wrapper.children).map(child =>
            child.cloneNode(true)
        );

        // Animation state
        this.currentTransform = 0;
        this.animationId = null;
        this.lastTimestamp = null;
        this.isPaused = false;
        this.isManualControl = false;
        this.manualTimeout = null;

        this.init();
    }

    init() {
        // Wait until the logo images have loaded before measuring the strip.
        // Measuring too early (images not yet loaded → zero intrinsic width)
        // yields a tiny set width, which makes the scroll speed far too slow
        // and inflates the clone count. A fixed delay is unreliable, especially
        // right after the image files change and the cache is cold.
        this.whenImagesReady(() => {
            this.createSufficientDuplicates();
            this.setupInitialPosition();
            this.setupStyles();
            this.setupEvents();
            this.startAnimation();
        });
    }

    whenImagesReady(callback) {
        const imgs = Array.from(this.wrapper.querySelectorAll('img'));
        let remaining = imgs.filter(img => !img.complete).length;

        if (remaining === 0) {
            requestAnimationFrame(callback);
            return;
        }

        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            requestAnimationFrame(callback);
        };
        const onOne = () => { if (--remaining === 0) finish(); };

        imgs.forEach(img => {
            if (img.complete) return;
            img.addEventListener('load', onOne, { once: true });
            img.addEventListener('error', onOne, { once: true });
        });

        // Safety net in case a load/error event never arrives
        setTimeout(finish, 3000);
    }

    createSufficientDuplicates() {
        // Clear existing content
        this.wrapper.innerHTML = '';

        // Add original set first to measure
        this.originalLogos.forEach(logo => {
            this.wrapper.appendChild(logo.cloneNode(true));
        });

        // Force layout and measure
        this.container.offsetWidth; // Force reflow
        const originalSetWidth = this.wrapper.scrollWidth;
        const containerWidth = this.container.offsetWidth;

        // Calculate minimum sets needed for seamless infinite scroll
        // Need enough sets to cover: container width + buffer for smooth transitions
        const minSetsNeeded = Math.max(5, Math.ceil((containerWidth * 3) / originalSetWidth));

        // Clear and rebuild with calculated sets
        this.wrapper.innerHTML = '';

        for (let i = 0; i < minSetsNeeded; i++) {
            this.originalLogos.forEach(logo => {
                const clone = logo.cloneNode(true);
                if (i > 0) {
                    clone.setAttribute('aria-hidden', 'true');
                }
                this.wrapper.appendChild(clone);
            });
        }

        this.singleSetWidth = originalSetWidth;
        this.totalSets = minSetsNeeded;
    }

    setupInitialPosition() {
        // Start from a middle position to allow movement in both directions
        // For left direction: start at set 1 (can move to set 0 or set 2)
        // For right direction: start at set 1 (can move to set 0 or set 2)
        const middleSetIndex = 1;
        this.currentTransform = -middleSetIndex * this.singleSetWidth;
    }

    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #${this.container.id} {
                overflow: hidden;
                position: relative;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            
            #${this.container.id}::-webkit-scrollbar {
                display: none;
            }
            
            #${this.wrapperId} {
                display: flex;
                will-change: transform;
                transition: none;
            }
        `;

        document.head.appendChild(style);
        this.styleElement = style;

        // Set initial transform
        this.wrapper.style.transform = `translateX(${this.currentTransform}px)`;
    }

    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        const animate = (timestamp) => {
            if (this.lastTimestamp === null) {
                this.lastTimestamp = timestamp;
            }

            if (!this.isPaused && !this.isManualControl) {
                const deltaTime = timestamp - this.lastTimestamp;
                const speed = this.singleSetWidth / this.animationDuration; // pixels per millisecond

                // Direction determines animation direction
                const deltaTransform = speed * deltaTime * (this.direction === 'left' ? -1 : 1);

                this.currentTransform += deltaTransform;
                this.normalizeTransform();
                this.updateTransform();
            }

            this.lastTimestamp = timestamp;
            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    normalizeTransform() {
        // The strip is periodic: every set of logos is identical, so shifting by
        // exactly one set width is visually invisible. We wrap in BOTH automatic
        // and manual mode so dragging/wheeling can never reach a hard end — the
        // strip is genuinely endless in every mode. `while` (not `if`) handles
        // large wheel/drag deltas that overshoot the window in one step.
        const setWidth = this.singleSetWidth;
        const lowerBound = -setWidth * (this.totalSets - 2);

        while (this.currentTransform <= lowerBound) {
            this.currentTransform += setWidth;
        }
        while (this.currentTransform >= 0) {
            this.currentTransform -= setWidth;
        }
    }

    updateTransform() {
        this.wrapper.style.transform = `translateX(${this.currentTransform}px)`;
    }

    setupEvents() {
        // Handle hover pause
        this.container.addEventListener('mouseenter', () => {
            this.isPaused = true;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isPaused = false;
        });

        // Handle wheel scrolling
        this.container.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();

                this.enterManualMode();

                let scrollDelta = e.deltaY * 0.5; // Adjust sensitivity

                // Consistent scroll direction: scroll down = move logos left (negative transform)
                // This feels natural regardless of the logo animation direction
                this.currentTransform -= scrollDelta;

                this.normalizeTransform();
                this.updateTransform();
                this.exitManualMode();
            }
        }, { passive: false });

        // Handle touch events
        let startX = 0;
        let startY = 0;
        let startTransform = 0;
        let isDragging = false;
        let isHorizontalScroll = false;

        this.container.addEventListener('touchstart', (e) => {
            isDragging = true;
            isHorizontalScroll = false;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTransform = this.currentTransform;
            this.enterManualMode();
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;

            // Determine scroll direction on first significant movement
            if (!isHorizontalScroll && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
                isHorizontalScroll = Math.abs(deltaX) > Math.abs(deltaY);
            }

            if (isHorizontalScroll) {
                // Prevent vertical scrolling when scrolling horizontally through logos
                e.preventDefault();

                // Natural touch behavior: dragging right moves content right (positive transform)
                this.currentTransform = startTransform + deltaX;
                this.normalizeTransform();
                this.updateTransform();
            }
            // If not horizontal scroll, allow default vertical scrolling behavior
        }, { passive: false }); // Changed to passive: false to allow preventDefault

        this.container.addEventListener('touchend', () => {
            isDragging = false;
            isHorizontalScroll = false;
            this.exitManualMode();
        }, { passive: true });

        // Handle mouse drag
        let isMouseDragging = false;
        let mouseStartX = 0;
        let mouseStartTransform = 0;

        this.container.addEventListener('mousedown', (e) => {
            isMouseDragging = true;
            mouseStartX = e.clientX;
            mouseStartTransform = this.currentTransform;
            this.enterManualMode();
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;

            const deltaX = e.clientX - mouseStartX;
            this.currentTransform = mouseStartTransform + deltaX;
            this.normalizeTransform();
            this.updateTransform();
        });

        document.addEventListener('mouseup', () => {
            if (isMouseDragging) {
                isMouseDragging = false;
                this.exitManualMode();
            }
        });
    }

    enterManualMode() {
        this.isManualControl = true;
        clearTimeout(this.manualTimeout);
    }

    exitManualMode() {
        clearTimeout(this.manualTimeout);
        this.manualTimeout = setTimeout(() => {
            // Position is already kept within the safe window by normalizeTransform
            // on every manual update, so resuming is seamless with no extra work.
            this.isManualControl = false;
        }, 1000);
    }

    setSpeed(durationSeconds) {
        this.animationDuration = durationSeconds * 1000;
    }

    setDirection(direction) {
        if (!['left', 'right'].includes(direction)) {
            throw new Error("Direction must be 'left' or 'right'");
        }
        this.direction = direction;
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
        this.isManualControl = false;
    }

    destroy() {
        if (this.styleElement) {
            this.styleElement.remove();
        }
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        clearTimeout(this.manualTimeout);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Destroy any existing instances first
    if (window.topLogoScroller) {
        window.topLogoScroller.destroy();
    }
    if (window.bottomLogoScroller) {
        window.bottomLogoScroller.destroy();
    }

    window.topLogoScroller = new InfiniteScroller('logoTopContainer', 'logoTopWrapper', 'left', 40);
    window.bottomLogoScroller = new InfiniteScroller('logoBottomContainer', 'logoBottomWrapper', 'right', 40);
});