const tabButtons = document.querySelectorAll('.nav-link');
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get all images and reset animations
        const images = document.querySelectorAll('.product-image');
        images.forEach(img => {
            img.classList.remove('fade-in');
            void img.offsetWidth; // Trigger reflow
            img.classList.add('fade-in');
        });
    });
});