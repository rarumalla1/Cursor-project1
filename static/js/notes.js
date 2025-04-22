// Sidebar functionality
function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}

// Color picker functionality
let currentNoteId = null;
let currentPickerButton = null;
let currentColorPicker = null;

function createColorPicker() {
    // Create color picker if it doesn't exist
    if (!currentColorPicker) {
        currentColorPicker = document.createElement('div');
        currentColorPicker.className = 'color-picker-popup';
        currentColorPicker.innerHTML = `
            <div class="color-grid">
                <button class="color-dot note-color-default" data-color="default" title="Default"></button>
                <button class="color-dot note-color-red" data-color="red" title="Red"></button>
                <button class="color-dot note-color-orange" data-color="orange" title="Orange"></button>
                <button class="color-dot note-color-yellow" data-color="yellow" title="Yellow"></button>
                <button class="color-dot note-color-green" data-color="green" title="Green"></button>
                <button class="color-dot note-color-teal" data-color="teal" title="Teal"></button>
                <button class="color-dot note-color-blue" data-color="blue" title="Blue"></button>
                <button class="color-dot note-color-purple" data-color="purple" title="Purple"></button>
                <button class="color-dot note-color-pink" data-color="pink" title="Pink"></button>
                <button class="color-dot note-color-brown" data-color="brown" title="Brown"></button>
                <button class="color-dot note-color-gray" data-color="gray" title="Gray"></button>
            </div>
        `;
        document.body.appendChild(currentColorPicker);

        // Add click handlers to color dots
        currentColorPicker.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', function() {
                const color = this.dataset.color;
                updateNoteColor(color);
            });
        });
    }
}

// Color picker template
const colorPickerTemplate = `
    <div class="color-picker" style="display: none;">
        <div class="color-grid">
            <div class="color-option">
                <input type="radio" name="color" value="default" id="color-default">
                <label for="color-default" class="color-label note-color-default" title="Default"></label>
            </div>
            <div class="color-option">
                <input type="radio" name="color" value="red" id="color-red">
                <label for="color-red" class="color-label note-color-red" title="Red"></label>
            </div>
            <div class="color-option">
                <input type="radio" name="color" value="orange" id="color-orange">
                <label for="color-orange" class="color-label note-color-orange" title="Orange"></label>
            </div>
            <div class="color-option">
                <input type="radio" name="color" value="yellow" id="color-yellow">
                <label for="color-yellow" class="color-label note-color-yellow" title="Yellow"></label>
            </div>
            <div class="color-option">
                <input type="radio" name="color" value="green" id="color-green">
                <label for="color-green" class="color-label note-color-green" title="Green"></label>
            </div>
            <div class="color-option">
                <input type="radio" name="color" value="teal" id="color-teal">
                <label for="color-teal" class="color-label note-color-teal" title="Teal"></label>
            </div>
            <div class="color-option">
                <input type="radio" name="color" value="blue" id="color-blue">
                <label for="color-blue" class="color-label note-color-blue" title="Blue"></label>
            </div>
            <div class="color-option">
                <input type="radio" name="color" value="purple" id="color-purple">
                <label for="color-purple" class="color-label note-color-purple" title="Purple"></label>
            </div>
            <div class="color-option">
                <input type="radio" name="color" value="pink" id="color-pink">
                <label for="color-pink" class="color-label note-color-pink" title="Pink"></label>
            </div>
            <div class="color-option">
                <input type="radio" name="color" value="brown" id="color-brown">
                <label for="color-brown" class="color-label note-color-brown" title="Brown"></label>
            </div>
            <div class="color-option">
                <input type="radio" name="color" value="gray" id="color-gray">
                <label for="color-gray" class="color-label note-color-gray" title="Gray"></label>
            </div>
        </div>
    </div>
`;

function showColorPicker(button) {
    // Hide any existing color picker
    if (currentColorPicker) {
        currentColorPicker.remove();
    }

    // Create new color picker
    const picker = document.createElement('div');
    picker.innerHTML = colorPickerTemplate;
    const pickerElement = picker.firstElementChild;
    pickerElement.style.display = 'block';
    
    // Check if this is for a new note or existing note
    const noteCard = button.closest('.note-card');
    const isNewNote = !noteCard;
    
    // Position the picker
    const rect = button.getBoundingClientRect();
    pickerElement.style.position = 'absolute';
    
    if (isNewNote) {
        // For new note in modal
        const modalContent = button.closest('.modal-content');
        pickerElement.style.top = (rect.bottom - modalContent.getBoundingClientRect().top) + 'px';
        pickerElement.style.left = (rect.left - modalContent.getBoundingClientRect().left) + 'px';
        pickerElement.style.zIndex = '1050'; // Higher than modal's z-index
        
        // For new note, store the selected color in a hidden input
        const form = document.getElementById('addNoteForm');
        if (!form.querySelector('input[name="color"]')) {
            const colorInput = document.createElement('input');
            colorInput.type = 'hidden';
            colorInput.name = 'color';
            colorInput.value = 'default';
            form.appendChild(colorInput);
        }
        
        // Get current color if it exists
        const colorInput = form.querySelector('input[name="color"]');
        const currentColor = colorInput.value || 'default';
        const currentInput = pickerElement.querySelector(`input[value="${currentColor}"]`);
        if (currentInput) {
            currentInput.checked = true;
        }
        
        pickerElement.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => {
                colorInput.value = input.value;
                // Update the color picker button's background
                button.style.backgroundColor = getComputedStyle(document.querySelector(`.note-color-${input.value}`)).backgroundColor;
                hideColorPicker();
            });
        });
        
        // Append to modal content for proper stacking
        modalContent.appendChild(picker);
    } else {
        // For existing note
        pickerElement.style.top = rect.bottom + window.scrollY + 5 + 'px';
        pickerElement.style.left = rect.left + window.scrollX + 'px';
        pickerElement.style.zIndex = '1000';
        
        const noteId = noteCard.dataset.noteId;
        
        // Get current color and set it as checked
        const currentColor = noteCard.className.match(/note-color-(\w+)/)?.[1] || 'default';
        const currentInput = pickerElement.querySelector(`input[value="${currentColor}"]`);
        if (currentInput) {
            currentInput.checked = true;
        }
        
        pickerElement.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => {
                updateNoteColor(noteId, input.value);
                hideColorPicker();
            });
        });
        
        // Append to body for existing notes
        document.body.appendChild(picker);
    }

    currentColorPicker = picker;

    // Add click outside handler
    const handleClickOutside = (event) => {
        if (!pickerElement.contains(event.target) && !button.contains(event.target)) {
            hideColorPicker();
            document.removeEventListener('click', handleClickOutside);
        }
    };

    // Delay adding the click handler to prevent immediate triggering
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 0);
}

function hideColorPicker() {
    if (currentColorPicker) {
        currentColorPicker.remove();
        currentColorPicker = null;
    }
}

function updateNoteColor(noteId, color) {
    fetch('/update_note_color', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            note_id: noteId,
            color: color
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const noteCard = document.querySelector(`.note-card[data-note-id="${noteId}"]`);
            if (noteCard) {
                // Remove all existing color classes
                noteCard.classList.forEach(className => {
                    if (className.startsWith('note-color-')) {
                        noteCard.classList.remove(className);
                    }
                });
                // Add new color class
                noteCard.classList.add('note-color-' + color);
            }
        } else {
            console.error('Failed to update note color:', data.error);
        }
    })
    .catch(error => {
        console.error('Error updating note color:', error);
    });
}

// Modal functionality
function showAddNoteModal() {
    const modal = document.getElementById('addNoteModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function hideAddNoteModal() {
    const modal = document.getElementById('addNoteModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        // Reset form
        const form = document.getElementById('addNoteForm');
        if (form) {
            form.reset();
            delete form.dataset.editId;
        }
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize note colors
    document.querySelectorAll('.note-card').forEach(note => {
        const color = note.dataset.color || 'default';
        note.classList.add('note-color-' + color);
    });

    // Initialize color picker buttons
    document.querySelectorAll('.color-picker-btn').forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.stopPropagation();
            showColorPicker(this);
        });
    });

    // Initialize add note form
    const form = document.getElementById('addNoteForm');
    if (form) {
        // Add hidden color input if it doesn't exist
        if (!form.querySelector('input[name="color"]')) {
            const colorInput = document.createElement('input');
            colorInput.type = 'hidden';
            colorInput.name = 'color';
            colorInput.value = 'default';
            form.appendChild(colorInput);
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = form.querySelector('#title').value;
            const content = form.querySelector('#content').value;
            const color = form.querySelector('input[name="color"]').value || 'default';
            const editId = form.dataset.editId;
            
            const endpoint = editId ? `/edit_note/${editId}` : '/add_note';

            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    color: color
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    hideAddNoteModal();
                    if (data.note) {
                        // If we get the note data back, update the UI without reloading
                        if (editId) {
                            // Update existing note
                            const noteCard = document.querySelector(`.note-card[data-note-id="${editId}"]`);
                            if (noteCard) {
                                noteCard.querySelector('.note-title').textContent = data.note.title;
                                noteCard.querySelector('.note-content').textContent = data.note.content;
                                // Update color
                                noteCard.className = noteCard.className.replace(/note-color-\w+/g, '');
                                noteCard.classList.add('note-card', `note-color-${data.note.color}`);
                                noteCard.dataset.color = data.note.color;
                            }
                        } else {
                            // Add new note to the grid
                            const notesGrid = document.querySelector('.notes-grid');
                            const noteHtml = `
                                <div class="note-card note-color-${data.note.color}" data-note-id="${data.note.id}" data-color="${data.note.color}">
                                    <div class="note-header">
                                        <h5 class="note-title">${data.note.title}</h5>
                                        <div class="note-actions">
                                            <button class="btn btn-link color-picker-btn" onclick="showColorPicker(this)" title="Change color">
                                                <i class="fa-solid fa-palette"></i>
                                            </button>
                                            <button class="btn btn-link" onclick="editNote(${data.note.id})" title="Edit">
                                                <i class="fa-solid fa-pen"></i>
                                            </button>
                                            <button class="btn btn-link" onclick="archiveNote(${data.note.id})" title="Archive">
                                                <i class="fa-solid fa-box-archive"></i>
                                            </button>
                                            <button class="btn btn-link" onclick="deleteNote(${data.note.id})" title="Delete">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="note-content">${data.note.content}</div>
                                    <div class="note-footer">
                                        <small class="text-muted">Created: ${data.note.created_at}</small>
                                    </div>
                                </div>
                            `;
                            notesGrid.insertAdjacentHTML('afterbegin', noteHtml);
                            
                            // Hide empty state if it was showing
                            const emptyState = document.querySelector('.empty-state');
                            if (emptyState) {
                                emptyState.style.display = 'none';
                            }
                        }
                        
                        // Reset form
                        form.reset();
                        form.querySelector('input[name="color"]').value = 'default';
                        const colorPickerBtn = form.querySelector('.color-picker-btn');
                        if (colorPickerBtn) {
                            colorPickerBtn.style.backgroundColor = '';
                        }
                    } else {
                        // Fallback to page reload if we don't get note data
                        window.location.reload();
                    }
                } else {
                    throw new Error(data.error || 'Failed to save note');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while saving the note: ' + error.message);
            });
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('addNoteModal');
        if (event.target === modal) {
            hideAddNoteModal();
        }
    });

    // Handle escape key to close modal and color picker
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideAddNoteModal();
            hideColorPicker();
        }
    });
});

// Note Actions
function editNote(noteId) {
    fetch(`/get_note/${noteId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const form = document.getElementById('addNoteForm');
                form.elements.title.value = data.note.title;
                form.elements.content.value = data.note.content;
                form.dataset.editId = noteId;
                showAddNoteModal();
            }
        })
        .catch(error => console.error('Error:', error));
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        fetch(`/delete_note/${noteId}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const noteElement = document.querySelector(`.note-card[data-note-id="${noteId}"]`);
                    if (noteElement) {
                        noteElement.remove();
                    }
                } else {
                    throw new Error(data.error || 'Failed to delete note');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the note: ' + error.message);
            });
    }
}

function archiveNote(noteId) {
    fetch(`/archive_note/${noteId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const noteElement = document.querySelector(`.note-card[data-note-id="${noteId}"]`);
                if (noteElement) {
                    noteElement.remove();
                }
            } else {
                throw new Error(data.error || 'Failed to archive note');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while archiving the note: ' + error.message);
        });
} 