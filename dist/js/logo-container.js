class InfiniteScroller {
    constructor(containerId, wrapperId, direction, durationForOneFullScrollS) {
        this.container = document.getElementById(containerId);
        this.wrapperId = wrapperId;
        this.wrapper = document.getElementById(this.wrapperId);
        this.direction = direction; // 'left' or 'right'
        this.animationDuration = durationForOneFullScrollS; // seconds

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

        this.isManualScrolling = false;
        this.scrollCheckInterval = null;
        this.lastScrollLeft = 0; // Track last scroll position
        this.scrollVelocity = 0; // Track scroll velocity

        this.init();
    }

    init() {
        setTimeout(() => {
            this.createSufficientDuplicates();
            this.setupInitialPosition();
            this.setupCSSAnimation();
            this.setupEvents();
            this.startScrollMonitoring();
        }, 100);
    }

    createSufficientDuplicates() {
        // Clear existing content
        this.wrapper.innerHTML = '';

        // Calculate how many sets we need - increased buffer
        const containerWidth = this.container.offsetWidth;
        const originalSetWidth = this.calculateOriginalSetWidth();
        // Increased multiplier from 4 to 8 for more buffer
        const minSetsNeeded = Math.max(8, Math.ceil((containerWidth * 8) / originalSetWidth));

        // Create the sets
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

    calculateOriginalSetWidth() {
        const tempWrapper = document.createElement('div');
        tempWrapper.style.cssText = `
            position: absolute;
            visibility: hidden;
            display: flex;
            white-space: nowrap;
            top: -9999px;
        `;

        this.originalLogos.forEach(logo => {
            tempWrapper.appendChild(logo.cloneNode(true));
        });

        document.body.appendChild(tempWrapper);
        const width = tempWrapper.scrollWidth;
        document.body.removeChild(tempWrapper);

        return width;
    }

    setupInitialPosition() {
        // Start from a more central position with more buffer
        const middlePosition = this.singleSetWidth * Math.floor(this.totalSets / 2);
        this.container.scrollLeft = middlePosition;
        this.lastScrollLeft = middlePosition;
    }

    setupCSSAnimation() {
        // Animation always moves one set width in the specified direction
        const translateStart = this.direction === 'left' ? '0' : `-${this.singleSetWidth}px`;
        const translateEnd = this.direction === 'left' ? `-${this.singleSetWidth}px` : '0';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes infiniteScroll-${this.wrapperId} {
                0% { transform: translateX(${translateStart}); }
                100% { transform: translateX(${translateEnd}); }
            }
            
            #${this.wrapperId} {
                animation: infiniteScroll-${this.wrapperId} ${this.animationDuration}s linear infinite;
                animation-play-state: running;
                display: flex;
                will-change: transform;
            }
            
            #${this.wrapperId}:hover {
                animation-play-state: paused;
            }
            
            #${this.container.id}:hover #${this.wrapperId} {
                animation-play-state: paused;
            }
            
            #${this.container.id} {
                overflow-x: auto;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            
            #${this.container.id}::-webkit-scrollbar {
                display: none;
            }
        `;

        document.head.appendChild(style);
        this.styleElement = style;
    }

    startScrollMonitoring() {
        // Reduced frequency to every 100ms instead of 16ms
        this.scrollCheckInterval = setInterval(() => {
            this.normalizeScrollPosition();
        }, 100);
    }

    normalizeScrollPosition() {
        const currentScroll = this.container.scrollLeft;
        const setWidth = this.singleSetWidth;

        // Calculate scroll velocity
        this.scrollVelocity = currentScroll - this.lastScrollLeft;
        this.lastScrollLeft = currentScroll;

        // Only normalize if we're not manually scrolling and not recently scrolling
        if (this.isManualScrolling || Math.abs(this.scrollVelocity) > 1) {
            return;
        }

        // More conservative bounds - only normalize when really necessary
        const bufferSets = 2; // Keep 2 sets as buffer on each side
        const minScroll = setWidth * bufferSets;
        const maxScroll = setWidth * (this.totalSets - bufferSets - 1);

        if (currentScroll < minScroll) {
            // Only jump if we're getting close to the edge
            this.container.scrollLeft = currentScroll + setWidth;
        } else if (currentScroll > maxScroll) {
            // Only jump if we're getting close to the edge
            this.container.scrollLeft = currentScroll - setWidth;
        }
    }

    setupEvents() {
        let scrollTimeout;

        // Handle wheel scrolling
        this.container.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();

                // Pause animation and enter manual mode
                this.isManualScrolling = true;
                this.wrapper.style.animationPlayState = 'paused';

                // Apply scroll based on direction preference
                let scrollDelta = e.deltaY;

                // For right direction, reverse the scroll mapping so it feels natural
                if (this.direction === 'right') {
                    scrollDelta = -scrollDelta;
                }

                this.container.scrollLeft += scrollDelta;

                // Resume after user stops - increased timeout
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.resumeFromCurrentPosition();
                }, 1500); // Increased from 1000ms
            }
        }, { passive: false });

        // Handle touch/mouse scrolling
        this.container.addEventListener('scroll', () => {
            if (!this.isManualScrolling) return;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.resumeFromCurrentPosition();
            }, 1500); // Increased from 1000ms
        });

        // Handle touch events
        this.container.addEventListener('touchstart', () => {
            this.isManualScrolling = true;
            this.wrapper.style.animationPlayState = 'paused';
        });

        this.container.addEventListener('touchend', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.resumeFromCurrentPosition();
            }, 1500); // Increased from 1000ms
        });
    }

    resumeFromCurrentPosition() {
        // Calculate position within the current set
        const currentScroll = this.container.scrollLeft;
        const positionInSet = currentScroll % this.singleSetWidth;

        // Calculate what the transform should be to sync with scroll position
        let targetTransform;

        if (this.direction === 'left') {
            // For left direction: transform goes from 0 to -setWidth
            targetTransform = -positionInSet;
        } else {
            // For right direction: transform goes from -setWidth to 0
            targetTransform = -(this.singleSetWidth - positionInSet);
        }

        // Apply the calculated transform
        this.wrapper.style.transform = `translateX(${targetTransform}px)`;

        // Resume animation
        this.isManualScrolling = false;
        this.wrapper.style.animationPlayState = 'running';

        // Force reflow
        this.wrapper.offsetHeight;
    }

    setSpeed(duration) {
        this.animationDuration = duration;
        this.wrapper.style.animationDuration = `${duration}s`;
    }

    setDirection(direction) {
        if (!['left', 'right'].includes(direction)) {
            throw new Error("Direction must be 'left' or 'right'");
        }

        this.direction = direction;

        // Remove old style and recreate
        if (this.styleElement) {
            this.styleElement.remove();
        }
        this.setupCSSAnimation();
    }

    pause() {
        this.wrapper.style.animationPlayState = 'paused';
    }

    resume() {
        this.isManualScrolling = false;
        this.wrapper.style.animationPlayState = 'running';
    }

    destroy() {
        if (this.styleElement) {
            this.styleElement.remove();
        }
        if (this.scrollCheckInterval) {
            clearInterval(this.scrollCheckInterval);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Destroy any existing instance first
    if (window.topLogoScroller) {
        window.topLogoScroller.destroy();
    }
    window.topLogoScroller = new InfiniteScroller('logoTopContainer', 'logoTopWrapper', 'left', 40);
    window.bottomLogoScroller = new InfiniteScroller('logoBottomContainer', 'logoBottomWrapper', 'right', 40);
});