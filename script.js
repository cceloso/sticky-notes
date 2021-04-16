// Selectors
const dropdown = document.querySelector(".dropdown");
const deleteOption = document.querySelector(".delete-option");
const executeBtn = document.querySelector(".execute-btn");
const lockBtn = document.querySelector(".lock-btn");
const notesContainer = document.querySelector(".notes-container");
let locked = false;

// Event listeners
document.addEventListener('DOMContentLoaded', getNoteInfo);
executeBtn.addEventListener("click", executeOption);
lockBtn.addEventListener("click", toggleLock);
notesContainer.addEventListener("click", deleteSingleNote);
notesContainer.addEventListener("input", saveNoteInfo); // what to use? input/keyup/change listener?

// Functions
function toggleDeleteOption() {
    let note = document.querySelector(".note");

    // Hide delete option in dropdown if there are no notes
    if(note == null) {
        deleteOption.style.display = "none";
    } else {
        deleteOption.style.display = "block";
    }
}

function executeOption(e) {
    // Prevent form from submitting
    e.preventDefault();

    switch(dropdown.value) {
        case "--":
            console.log("--");
            break;
        case "add":
            console.log("add");
            addNote();
            break;
        case "delete":
            console.log("delete");
            dropdown.value = "--";
            deleteAllNotes(notesContainer);
            break;
    }

    toggleDeleteOption();
}

function toggleTextareas() {
    // Select all textareas and enable/disable editing
    const textareas = document.getElementsByTagName("textarea");

    if(textareas == null) {
        return;
    }

    for(let i = 0; i < textareas.length; i++) {
        textareas[i].disabled = locked;
    }
}

function toggleDeleteBtn() {
    const deleteBtns = document.getElementsByClassName("delete-btn");

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

    if(lockBtn.textContent == "Lock Editing") {
        lockBtn.textContent = "Unlock Editing";
        locked = true;
    } else {
        lockBtn.textContent = "Lock Editing";
        locked = false;
    }

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

    // Delete button
    const deleteBtnContainer = document.createElement("div");
    deleteBtnContainer.classList.add("delete-btn-container");
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

    if(isCalledByAddNote) {
        const noteIndex = getChildElementIndex(noteDiv)
        // Save note title to local storage
        saveLocalNoteTitles(noteTitle.value, noteIndex);

        // Save note content to local storage
        saveLocalNoteContents(noteContent.value, noteIndex);
    }
}

function addNote() {
    if(locked) {
        return;
    }
    
    // Create note
    createNoteStructure("", "", true);
}

function deleteSingleNote(e) {
    if(locked) {
        return;
    }

    const item = e.target;
    // console.log(item);

    // Delete note
    if(item.classList[0] === "delete-btn") {
        console.log("Delete button is selected!");
        const itemParent = item.parentElement; // delete-btn-container div
        const itemGrandparent = itemParent.parentElement; // title-delete-container div 
        const itemGreatGrandparent = itemGrandparent.parentElement; // note div

        // Get index of note as a child of notes-container
        const noteIndex = getChildElementIndex(itemGreatGrandparent);
        console.log(noteIndex);

        removeNoteInfo(noteIndex, false);

        itemGreatGrandparent.remove();
    }
}

function deleteAllNotes(container) {
    if(locked) {
        return;
    }
    
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    removeNoteInfo(0, true);
}

function getChildElementIndex(node) {
    return Array.prototype.indexOf.call(node.parentNode.children, node);
  }

function saveNoteInfo(e) {
    const item = e.target;

    const titleParent = item.parentElement; // [for note-title: title-delete-container div; for note-content: note div]
    const titleGrandparent = titleParent.parentElement; // [for note-title: note div; for note-content: notes-container]

    // Save note title
    if(item.classList[0] === "note-title") {
        // console.log("Note title is selected!");
        const title = item.value;
        console.log(title);
        // console.log(typeof title);

        // Get index of note as a child of notes-container
        const noteIndex = getChildElementIndex(titleGrandparent);
        console.log(noteIndex);

        saveLocalNoteTitles(title, noteIndex);
    } else if(item.classList[0] === "note-content") {
        console.log(item);
        const content = item.value;
        console.log(content);

        // Get index of note as a child of notes-container
        const noteIndex = getChildElementIndex(titleParent);
        console.log(noteIndex);

        saveLocalNoteContents(content, noteIndex);
    }
}

// const noteTitles = [];

function saveLocalNoteTitles(noteTitle, noteIndex) {
    // Check if there's already a container for note titles
    let noteTitles;
    if(localStorage.getItem('noteTitles') === null) {
        noteTitles = [];
    } else {
        noteTitles = JSON.parse(localStorage.getItem('noteTitles'));
    }

    console.log(`noteIndex: ${noteIndex}, noteTitles.len: ${noteTitles.length}`)
    if(noteIndex >= noteTitles.length) {
        noteTitles.push(noteTitle);
    } else {
        noteTitles[noteIndex] = noteTitle;
    }
    console.log(noteTitles);
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

    console.log(`noteIndex: ${noteIndex}, noteContents.len: ${noteContents.length}`)
    if(noteIndex >= noteContents.length) {
        noteContents.push(noteContent);
    } else {
        noteContents[noteIndex] = noteContent;
    }
    console.log(noteContents);
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

    for(let i = 0; i < noteTitles.length; i++) {
        createNoteStructure(noteTitles[i], noteContents[i], false);
    }
}

function getTitles() {
    // Check if there's already a container for note titles
    let noteTitles;
    if(localStorage.getItem('noteTitles') === null) {
        noteTitles = [];
    } else {
        noteTitles = JSON.parse(localStorage.getItem('noteTitles'));
    }

    noteTitles.forEach(function(noteTitleStored) {
        createNoteStructure(noteTitleStored, "", false);
    });
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

    // Remove note title/s and note content/s in local storage
    // Splice all elements in array if this function is called by deleteAllNotes; else, just splice one element
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