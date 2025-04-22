// Color picker popup template
const colorPickerTemplate = `
    <div class="color-picker-popup">
        <div class="color-option note-color-default" data-color="default"></div>
        <div class="color-option note-color-red" data-color="red"></div>
        <div class="color-option note-color-orange" data-color="orange"></div>
        <div class="color-option note-color-yellow" data-color="yellow"></div>
        <div class="color-option note-color-green" data-color="green"></div>
        <div class="color-option note-color-teal" data-color="teal"></div>
        <div class="color-option note-color-blue" data-color="blue"></div>
        <div class="color-option note-color-purple" data-color="purple"></div>
        <div class="color-option note-color-pink" data-color="pink"></div>
        <div class="color-option note-color-brown" data-color="brown"></div>
        <div class="color-option note-color-gray" data-color="gray"></div>
    </div>
`;

// Handle color picker selection in the add note form
document.querySelectorAll('.color-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });
        this.parentElement.classList.add('selected');
    });
});

// Current active color picker popup
let activePopup = null;

// Close color picker when clicking outside
document.addEventListener('click', (e) => {
    if (activePopup && !e.target.closest('.color-picker-popup') && !e.target.closest('.btn-color-picker')) {
        activePopup.remove();
        activePopup = null;
    }
});

// Show/hide color picker for existing notes
function toggleColorPicker(button) {
    const noteCard = button.closest('.note-card');
    const noteId = noteCard.dataset.noteId;

    // Remove any existing color picker
    if (activePopup) {
        activePopup.remove();
        if (activePopup.parentElement === button.parentElement) {
            activePopup = null;
            return;
        }
    }

    // Create and position the color picker
    const popup = document.createElement('div');
    popup.innerHTML = colorPickerTemplate;
    popup.firstElementChild.style.position = 'absolute';
    popup.firstElementChild.style.zIndex = '1000';
    button.parentElement.appendChild(popup.firstElementChild);
    activePopup = popup.firstElementChild;

    // Position the popup above the button
    const buttonRect = button.getBoundingClientRect();
    const popupRect = activePopup.getBoundingClientRect();
    activePopup.style.top = `${-popupRect.height - 10}px`;
    activePopup.style.left = `${buttonRect.width/2 - popupRect.width/2}px`;

    // Add click handlers to color options
    activePopup.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', async () => {
            const color = option.dataset.color;
            
            // Update the note color in the database
            const response = await fetch(`/update_color/${noteId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `color=${color}`
            });

            if (response.ok) {
                // Update the note color in the UI
                noteCard.className = `note-card note-color-${color}`;
                activePopup.remove();
                activePopup = null;
            }
        });
    });
} 