// Selectors
const dropdown = document.querySelector(".dropdown");
const deleteOption = document.querySelector(".delete-option");
const executeBtn = document.querySelector(".execute-btn");
const lockBtn = document.querySelector(".lock-btn");
const notesContainer = document.querySelector(".notes-container");
let locked = false;

// Event listeners
document.addEventListener("DOMContentLoaded", getNoteInfo);
executeBtn.addEventListener("click", executeOption);
lockBtn.addEventListener("click", toggleLock);
notesContainer.addEventListener("click", deleteSingleNote);
notesContainer.addEventListener("input", saveNoteInfo);
notesContainer.addEventListener("mouseover", showDeleteBtn);
notesContainer.addEventListener("mouseout", hideDeleteBtn);

// Functions
function showDeleteBtn(e) {
    const item = e.target;

    // If mouse hovers over delete-btn-container div, show delete-btn
    if(item.classList[0] === "delete-btn-container") {
        // console.log("Inside delete button container!");
        const deleteBtn = item.firstChild;
        deleteBtn.style.visibility = "visible";    
    }
}

function hideDeleteBtn(e) {
    const item = e.target;

    // If mouse hover gets out of delete-btn-container div, hide delete-btn
    if(item.classList[0] === "delete-btn-container") {
        const deleteBtn = item.firstChild;
        setTimeout(function () {
            deleteBtn.style.visibility = "hidden";
        }, 300);
    }
}

function toggleDeleteOption() {
    // Select all notes (may be null if there is none)
    let note = document.querySelector(".note");

    // Hide delete all buttons option in dropdown if there are no notes
    if(note == null) {
        deleteOption.style.display = "none";
    } else {
        deleteOption.style.display = "block";
    }
}

function executeOption(e) {
    // Prevent form from submitting
    e.preventDefault();

    // Check selected value in dropdown and do corresponding action
    switch(dropdown.value) {
        case "--":
            // console.log("--");
            break;
        case "add":
            // console.log("add");
            addNote();
            break;
        case "delete":
            // console.log("delete");
            dropdown.value = "--";
            deleteAllNotes(notesContainer);
            break;
    }

    // Check if there are still notes left; if none, hide delete all buttons option in dropdown
    toggleDeleteOption();
}

function toggleTextareas() {
    // Select all textareas (may be null if there is none)
    const textareas = document.getElementsByTagName("textarea");

    // Enable/disable textarea editing if there is any textarea field (i.e., there is at least one note)
    if(textareas == null) {
        return;
    }

    for(let i = 0; i < textareas.length; i++) {
        textareas[i].disabled = locked;
    }
}

function toggleDeleteBtn() {
    // Select all delete buttons (may be null if there is none)
    const deleteBtns = document.getElementsByClassName("delete-btn");

    // Show/hide delete button if there is any (i.e., there is at least one note)
    if(deleteBtns == null) {
        return;
    }

    let deleteBtnDisplay;

    if(locked) {
        deleteBtnDisplay = "none";
    } else {
        deleteBtnDisplay = "block";
    }

    for(let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].style.display = deleteBtnDisplay;
    }
}

function toggleLock(e) {
    // Prevent form from submitting
    e.preventDefault();

    // Change text shown in lock button; show/hide dropdown and execute button depending on locked state
    if(lockBtn.textContent == "Lock Editing") {
        locked = true;
        lockBtn.textContent = "Unlock Editing";
        executeBtn.style.display = "none";
        dropdown.style.display = "none";
    } else {
        locked = false;
        lockBtn.textContent = "Lock Editing";
        executeBtn.style.display = "flex";
        dropdown.style.display = "flex";
    }

    // Enable/disable textareas and show/hide delete buttons depending on locked state
    toggleTextareas();
    toggleDeleteBtn();
}

function createNoteStructure(noteTitleInput, noteContentInput, isCalledByAddNote) {
    // Note div
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");

    // Note title and delete button container
    const titleDeleteContainer = document.createElement("div");
    titleDeleteContainer.classList.add("title-delete-container");

    // Note title
    const noteTitle = document.createElement("textarea");
    noteTitle.classList.add("note-title");
    noteTitle.placeholder = "Title";
    noteTitle.rows = "1";
    noteTitle.spellcheck = false;
    noteTitle.value = noteTitleInput;
    titleDeleteContainer.appendChild(noteTitle);

    // Delete button container
    const deleteBtnContainer = document.createElement("div");
    deleteBtnContainer.classList.add("delete-btn-container");

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.type = "submit";
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtnContainer.appendChild(deleteBtn);
    titleDeleteContainer.appendChild(deleteBtnContainer);
    noteDiv.appendChild(titleDeleteContainer);

    // Note content
    const noteContent = document.createElement("textarea");
    noteContent.classList.add("note-content");
    noteContent.placeholder = "Content";
    noteContent.spellcheck = false;
    noteContent.value = noteContentInput;
    noteDiv.appendChild(noteContent);

    // Append note to container
    notesContainer.appendChild(noteDiv);

    // If note is newly added (not loaded on refresh), save note info to local storage
    if(isCalledByAddNote) {
        const noteIndex = getChildElementIndex(noteDiv);

        // Save note title and note content to local storage
        saveLocalNoteTitles(noteTitle.value, noteIndex);
        saveLocalNoteContents(noteContent.value, noteIndex);
    }
}

function addNote() {
    // Disable addition of notes if locked is true 
    if(locked) {
        return;
    }
    
    // Create note
    createNoteStructure("", "", true);
}

function deleteSingleNote(e) {
    // Disable deletion of single notes if locked is true 
    if(locked) {
        return;
    }

    const item = e.target;
    // console.log(item);

    // If delete button container is clicked, delete note
    if(item.classList[0] === "delete-btn-container") {
        // console.log("Delete button is selected!");
        const itemParent = item.parentElement; // title-delete-container div
        const itemGrandparent = itemParent.parentElement; // note div

        // Get index of note as a child of notes container
        const noteIndex = getChildElementIndex(itemGrandparent);
        // console.log(noteIndex);

        // Delete note from local storage
        removeNoteInfo(noteIndex, false);

        // Delete note from DOM
        itemGrandparent.remove();
    }

    // Check if there are still notes left; if none, hide delete all buttons option in dropdown
    toggleDeleteOption();
}

function deleteAllNotes(container) {
    // Disable deletion of notes if locked is true
    if(locked) {
        return;
    }
    
    // Delete all notes from DOM
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Delete all notes from local storage
    removeNoteInfo(0, true);
}

function getChildElementIndex(node) {
    // Get index of node as a child of parent
    return Array.prototype.indexOf.call(node.parentNode.children, node);
  }

function saveNoteInfo(e) {
    const item = e.target;

    const titleParent = item.parentElement; // [for note-title: title-delete-container div; for note-content: note div]
    const titleGrandparent = titleParent.parentElement; // [for note-title: note div; for note-content: notes-container]

    // Save note title or note content
    if(item.classList[0] === "note-title") {
        // console.log("Note title is selected!");
        const title = item.value;
        // console.log(title);

        // Get index of note as a child of notes-container
        const noteIndex = getChildElementIndex(titleGrandparent);
        // console.log(noteIndex);

        // Save note title to local storage
        saveLocalNoteTitles(title, noteIndex);
    } else if(item.classList[0] === "note-content") {
        // console.log(item);
        const content = item.value;
        // console.log(content);

        // Get index of note as a child of notes-container
        const noteIndex = getChildElementIndex(titleParent);
        // console.log(noteIndex);

        // Save note content to local storage
        saveLocalNoteContents(content, noteIndex);
    }
}

function saveLocalNoteTitles(noteTitle, noteIndex) {
    // Check if there's already a container for note titles
    let noteTitles;
    if(localStorage.getItem('noteTitles') === null) {
        noteTitles = [];
    } else {
        noteTitles = JSON.parse(localStorage.getItem('noteTitles'));
    }

    // If note title for the specific note is not yet saved, push it to array; else, just update its value
    // console.log(`noteIndex: ${noteIndex}, noteTitles.len: ${noteTitles.length}`);
    if(noteIndex >= noteTitles.length) {
        noteTitles.push(noteTitle);
    } else {
        noteTitles[noteIndex] = noteTitle;
    }
    // console.log(noteTitles);
    localStorage.setItem('noteTitles', JSON.stringify(noteTitles));
}

function saveLocalNoteContents(noteContent, noteIndex) {
    // Check if there's already a container for note contents
    let noteContents;
    if(localStorage.getItem('noteContents') === null) {
        noteContents = [];
    } else {
        noteContents = JSON.parse(localStorage.getItem('noteContents'));
    }

    // If note content for the specific note is not yet saved, push it to array; else, just update its value
    // console.log(`noteIndex: ${noteIndex}, noteContents.len: ${noteContents.length}`);
    if(noteIndex >= noteContents.length) {
        noteContents.push(noteContent);
    } else {
        noteContents[noteIndex] = noteContent;
    }
    // console.log(noteContents);
    localStorage.setItem('noteContents', JSON.stringify(noteContents));
}

function getNoteInfo() {
    // Check if there's already a container for note titles
    let noteTitles;
    if(localStorage.getItem('noteTitles') === null) {
        noteTitles = [];
    } else {
        noteTitles = JSON.parse(localStorage.getItem('noteTitles'));
    }

    // Check if there's already a container for note contents
    let noteContents;
    if(localStorage.getItem('noteContents') === null) {
        noteContents = [];
    } else {
        noteContents = JSON.parse(localStorage.getItem('noteContents'));
    }

    // Create notes based from note titles and note contents stored in local storage
    for(let i = 0; i < noteTitles.length; i++) {
        createNoteStructure(noteTitles[i], noteContents[i], false);
    }
}

function removeNoteInfo(noteIndex, isCalledByDeleteAllNotes) {
    // Check if there's already a container for note titles
    let noteTitles;
    if(localStorage.getItem('noteTitles') === null) {
        noteTitles = [];
    } else {
        noteTitles = JSON.parse(localStorage.getItem('noteTitles'));
    }

    // Check if there's already a container for note contents
    let noteContents;
    if(localStorage.getItem('noteContents') === null) {
        noteContents = [];
    } else {
        noteContents = JSON.parse(localStorage.getItem('noteContents'));
    }

    // Remove note titles and note contents in local storage
    // Splice all elements in array if this function is called by deleteAllNotes (i.e., make array empty); else, just splice one element
    if(isCalledByDeleteAllNotes) {
        noteTitles.splice(noteIndex, noteTitles.length);
        noteContents.splice(noteIndex, noteContents.length);
    } else {
        noteTitles.splice(noteIndex, 1);
        noteContents.splice(noteIndex, 1);
    }
    
    localStorage.setItem('noteTitles', JSON.stringify(noteTitles));
    localStorage.setItem('noteContents', JSON.stringify(noteContents));
}