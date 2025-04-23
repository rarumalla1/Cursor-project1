document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    let sidebarOverlay = document.querySelector('.sidebar-overlay');

    // Create sidebar overlay if it doesn't exist
    if (!sidebarOverlay) {
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'sidebar-overlay';
        document.body.appendChild(sidebarOverlay);
    }

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        mainContent.classList.toggle('sidebar-open');
        sidebarOverlay.classList.toggle('show');
    }

    // Toggle sidebar when button is clicked
    sidebarToggle.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking overlay on mobile
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // Close sidebar when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            toggleSidebar();
        }
    });

    // Close sidebar when resizing to desktop if it was open on mobile
    let isMobile = window.innerWidth <= 768;
    window.addEventListener('resize', function() {
        const wasDesktop = !isMobile;
        isMobile = window.innerWidth <= 768;
        
        // If transitioning from mobile to desktop and sidebar is open
        if (wasDesktop && isMobile && sidebar.classList.contains('open')) {
            toggleSidebar();
        }
    });
}); 