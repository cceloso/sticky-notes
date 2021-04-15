// Selectors
const dropdown = document.querySelector(".dropdown");
const executeBtn = document.querySelector(".execute-btn");
const lockBtn = document.querySelector(".lock-btn");
const notesContainer = document.querySelector(".notes-container");

// Event listeners
executeBtn.addEventListener("click", executeOption);
lockBtn.addEventListener("click", toggleLock);

// Functions
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
}

function toggleTextareas(textareas) {
    for(let i = 0; i < textareas.length; i++) {
        textareas[i].disabled = !(textareas[i].disabled);
    }
}

function toggleLock(e) {
    // Prevent form from submitting
    e.preventDefault();

    // Select all textareas and enable/disable editing
    const textareas = document.getElementsByTagName("textarea");

    if(lockBtn.textContent == "Lock Editing") {
        lockBtn.textContent = "Unlock Editing";
    } else {
        lockBtn.textContent = "Lock Editing";
    }

    toggleTextareas(textareas);
}

function addNote() {
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
    titleDeleteContainer.appendChild(noteTitle);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.type = "submit";
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    titleDeleteContainer.appendChild(deleteBtn);
    noteDiv.appendChild(titleDeleteContainer);

    // Note content
    const noteContent = document.createElement("textarea");
    noteContent.classList.add("note-content");
    noteContent.placeholder = "Content";
    noteDiv.appendChild(noteContent);

    // Append note to container
    notesContainer.appendChild(noteDiv);
}

function deleteAllNotes(container) {
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
}