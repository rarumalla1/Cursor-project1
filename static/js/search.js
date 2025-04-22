// Search functionality
function searchNotes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const notes = document.querySelectorAll('.note-card');
    const emptyState = document.querySelector('.empty-state');
    let hasVisibleNotes = false;

    notes.forEach(note => {
        const title = note.querySelector('.note-title').textContent.toLowerCase();
        const content = note.querySelector('.note-content').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            note.style.display = '';
            hasVisibleNotes = true;
        } else {
            note.style.display = 'none';
        }
    });

    // Update empty state message
    if (emptyState) {
        if (!hasVisibleNotes && notes.length > 0) {
            emptyState.style.display = 'flex';
            document.getElementById('emptyStateMessage').textContent = 'No notes match your search';
        } else if (!hasVisibleNotes) {
            emptyState.style.display = 'flex';
            document.getElementById('emptyStateMessage').textContent = 'No notes yet. Create one!';
        } else {
            emptyState.style.display = 'none';
        }
    }
}

// Initialize search functionality when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchNotes);
    }
}); 