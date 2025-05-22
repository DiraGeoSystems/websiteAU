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

        // Calculate how many sets we need
        const containerWidth = this.container.offsetWidth;
        const originalSetWidth = this.calculateOriginalSetWidth();
        const minSetsNeeded = Math.max(4, Math.ceil((containerWidth * 4) / originalSetWidth));

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
        // Always start from the middle set to allow scrolling in both directions
        const middlePosition = this.singleSetWidth;
        this.container.scrollLeft = middlePosition;
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
        this.scrollCheckInterval = setInterval(() => {
            this.normalizeScrollPosition();
        }, 16);
    }

    normalizeScrollPosition() {
        const currentScroll = this.container.scrollLeft;
        const setWidth = this.singleSetWidth;

        // Keep scroll position within bounds by jumping between equivalent positions
        // We maintain at least one set width on each side for smooth transitions
        if (currentScroll <= 0) {
            // Jumped too far left, move to equivalent position one set to the right
            this.container.scrollLeft = currentScroll + setWidth;
        } else if (currentScroll >= setWidth * (this.totalSets - 1)) {
            // Jumped too far right, move to equivalent position one set to the left
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

                // Resume after user stops
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.resumeFromCurrentPosition();
                }, 1000);
            }
        }, { passive: false });

        // Handle touch/mouse scrolling
        this.container.addEventListener('scroll', () => {
            if (!this.isManualScrolling) return;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.resumeFromCurrentPosition();
            }, 1000);
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
            }, 1000);
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