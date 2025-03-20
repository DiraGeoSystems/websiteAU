const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", navHighlighter);

function navHighlighter() {
    let scrollY = window["pageYOffset"];
    
    // Get current page info
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Handle Products dropdown and current page highlighting
    if (currentPage === 'prosuite.html' || currentPage === 'locationfinder.html') {
        // Highlight the specific product link
        document.querySelectorAll(`.navbar a.nav-link[href$="${currentPage}"]`).forEach(link => {
            link.classList.add("active");
        });
        
        // Highlight the Products dropdown toggle
        document.querySelectorAll('.navbar .dropdown-toggle').forEach(dropdownToggle => {
            if (!dropdownToggle.classList.contains('nav-link-lang')) {
                dropdownToggle.classList.add("active");
            }
        });
    } else {
        // For non-product pages, highlight the current page link
        document.querySelectorAll(`.navbar a.nav-link[href$="${currentPage}"]`).forEach(link => {
            if (!link.classList.contains('nav-link-lang')) {
                link.classList.add("active");
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', navHighlighter);