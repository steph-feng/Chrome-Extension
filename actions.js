let toDosText = [];
let toDosCheckboxes = [];

let uniqueID = 0;

function initialize() {
    setTitle();

    if (localStorage.getItem('toDoItems')) {
        toDosText = JSON.parse(localStorage.getItem('toDoItems'));
    }

    if (localStorage.getItem('toDoCheckboxes')) {
        toDosCheckboxes = JSON.parse(localStorage.getItem('toDoCheckboxes'));
    }

    toDosText.forEach(toDo => {
        let checkbox = addNewItemElement(toDo);
        let index = toDosText.indexOf(toDo);
        if (toDosCheckboxes[index] === true) {
            checkbox.checked = true;
        }
    })
    addNewItemElement(''); 
}

function setTitle() {
    const titleElement = document.getElementById('title');

    titleElement.addEventListener('change', function () {
        localStorage.setItem('title', JSON.stringify(titleElement.value));
    })

    if (localStorage.getItem('title') !== '') {
        titleElement.value = JSON.parse(localStorage.getItem('title'));
    }
}

function addNewItemElement(value) {
    const newItem = document.createElement('div');
    newItem.setAttribute('class', 'flex');
    newItem.classList.add('container');

    const newCheckbox = document.createElement('input');
    newCheckbox.setAttribute('type', 'checkbox');
    newCheckbox.setAttribute('class', 'checkbox');

    const newTextarea = document.createElement('textarea');
    newTextarea.setAttribute('class', 'textarea');
    newTextarea.value = value;

    const newButton = document.createElement('button');
    newButton.innerHTML = '<i class="fa fa-trash "></i>';
    newButton.setAttribute('class', 'button');

    newItem.appendChild(newCheckbox);
    newItem.appendChild(newTextarea);
    newItem.appendChild(newButton);
    document.getElementById('items').appendChild(newItem);


    newTextarea.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addNewItemElement('');
            saveListItem(newTextarea)
            setTimeout(function () {
                let textAreas = document.querySelectorAll('.textarea');
                let newest = textAreas[textAreas.length - 1];
                newest.focus();
            }, 0);
        }
    });

    newTextarea.addEventListener('input', function () {
        saveListItem(newTextarea)
    })

    newCheckbox.addEventListener('click', function () {
        saveCheckboxes(newCheckbox);
    })

    newButton.addEventListener('click', function () {
        removeElementIfClicked(newButton)
    })

    return newCheckbox;
}

function saveListItem(textArea) {
    let index = Array.from(document.querySelectorAll('.textarea')).indexOf(textArea);

    if (textArea.value !== '') {
        toDosText[index] = textArea.value;
    } else {
        toDosText.splice(index, 1);
    }

    localStorage.setItem('toDoItems', JSON.stringify(toDosText));
    textArea.removeEventListener('input', saveListItem);
}

function saveCheckboxes(checkbox) {
    let index = Array.from(document.querySelectorAll('.checkbox')).indexOf(checkbox);

    if (checkbox.checked) {
        toDosCheckboxes[index] = true;
    } else {
        toDosCheckboxes[index] = false;
    }

    localStorage.setItem('toDoCheckboxes', JSON.stringify(toDosCheckboxes));
    checkbox.removeEventListener('click', saveCheckboxes);
}


function removeElementIfClicked(item) {
    const parent = item.parentElement;
    let text;
    parent.querySelectorAll('.child').forEach(child => {
        if (child.type === 'textarea') {
            text = child.value;
        }
        child.remove()
    });
    parent.remove();

    const removeIndex = toDosText.indexOf(text);
    toDosText.splice(removeIndex, 1);
    localStorage.setItem('toDoItems', JSON.stringify(toDosText));

    toDosCheckboxes.splice(removeIndex, 1);
    localStorage.setItem('toDoCheckboxes', JSON.stringify(toDosCheckboxes));

    item.removeEventListener('click', removeElementIfClicked);
}

window.addEventListener('DOMContentLoaded', initialize);

