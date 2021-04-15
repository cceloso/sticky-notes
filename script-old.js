let noteCtr = 0;

class Note {
    constructor(targetContainer) {
        this.container = document.querySelector(targetContainer);
        
        this.createNote();
    }

    createNote() {
        // Main container of note
        const notes = document.createElement('div');
        notes.classList.add('notes');
        notes.setAttribute('id', `note-${noteCtr}`);

        // Title
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('title-container');

        const title = document.createElement('h3');
        title.classList.add('title-overflow');
        title.textContent = 'Test Lorem Ipsum Blah Blah';
        
        titleContainer.appendChild(title);
        notes.appendChild(titleContainer);

        // Delete button
        const deleteButtonContainer = document.createElement('div');
        deleteButtonContainer.classList.add('delete-button-container');
        
        const deleteLink = document.createElement('a');
        
        const deleteImg = document.createElement('img');
        deleteImg.setAttribute('src', 'delete-button.png');
        deleteImg.setAttribute('alt', 'delete-button');

        deleteLink.appendChild(deleteImg);
        deleteButtonContainer.appendChild(deleteLink);
        notes.appendChild(deleteButtonContainer);

        // Clear float
        const clearFloat = document.createElement('div');
        clearFloat.classList.add('clear-float');
        notes.appendChild(clearFloat);

        // Content
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');
        contentContainer.textContent = 'Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content';
        notes.appendChild(contentContainer);

        this.container.appendChild(notes);
    }

    deleteNode(parent) {
        while(parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
}

const myTargetContainer = '#notes-container';
noteCtr++;
let noteOne = new Note(myTargetContainer);
noteCtr++;
let noteTwo = new Note(myTargetContainer);