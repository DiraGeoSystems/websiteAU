document.addEventListener('DOMContentLoaded', function () {
    const langButtons = document.querySelectorAll('.nav-link-lang');

    // Add class to body as soon as possible to help with initial styling
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');

    // Only check browser language if no URL parameter exists
    let selectedLang;
    if (langParam === 'de' || langParam === 'en') {
        selectedLang = langParam;
    } else {
        const browserLang = navigator.language || navigator.userLanguage;
        selectedLang = browserLang.startsWith('de') ? 'de' : 'en';
    }

    // Set the language class on the body element immediately
    document.body.classList.add(`lang-active-${selectedLang}`);

    // Initialize language on page load
    updateLanguage(selectedLang);

    langButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const lang = button.getAttribute('data-lang');
            updateLanguage(lang);
        });
    });

    function updateLanguage(lang) {
        // Update html lang attribute
        document.getElementById('htmlTag').setAttribute('lang', lang);

        // Update body class for CSS targeting
        document.body.className = document.body.className.replace(/lang-active-(en|de)/g, '');
        document.body.classList.add(`lang-active-${lang}`);

        // Update active state of language buttons
        document.querySelectorAll('.nav-link-lang').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Toggle visibility of language-specific elements - MODIFIED to handle tables properly
        document.querySelectorAll('[class*="lang-"]').forEach(element => {
            // Let CSS handle the display property instead of directly setting it
            // This allows our table-specific CSS rules to work properly
            if (element.classList.contains(`lang-${lang}`)) {
                element.style.removeProperty('display');
            } else {
                element.style.display = 'none';
            }
        });

        // Update all navigation links to include the current language
        document.querySelectorAll('a').forEach(link => {
            if (link.href && link.href.startsWith(window.location.origin)) {
                // Only modify internal links
                const url = new URL(link.href);
                if (!url.pathname.endsWith('.svg') && !url.pathname.endsWith('.png') && !url.pathname.endsWith('.jpg')) {
                    // Don't modify image links
                    url.searchParams.set('lang', lang);
                    link.href = url.toString();
                }
            }
        });

        // Update current URL without reloading
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
    }
});