let toDoData = [];

function initialize() {
    setTitle();

    if (localStorage.getItem('toDoData')) {
        toDoData = JSON.parse(localStorage.getItem('toDoData'));
    }

    toDoData.forEach(toDo => {
        if (toDo.toDoValue) {
            let checkbox = addNewItemElement(toDo.uniqueID, toDo.toDoValue);
            checkbox.checked = toDo.toDoChecked;
        }
    })

    addNewItemElement(generateUniqueID(), '');
}

function generateUniqueID() {
    return Date.now() + Math.random();
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

function addNewItemElement(id, value) {
    const newItem = document.createElement('div');
    newItem.setAttribute('class', 'flex');
    newItem.classList.add('container');
    newItem.setAttribute('id', id.toString());

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
            addNewItemElement(generateUniqueID(), '');
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

    const checkDuplicateIndex = toDoData.findIndex(element => element.uniqueID === id);
    if (checkDuplicateIndex === -1) {
        toDoData.push({uniqueID: id.toString(), toDoValue: value, toDoChecked: false});
    }

    return newCheckbox;
}

function saveListItem(textArea) {
    const parentId = textArea.parentElement.id;
    const index = toDoData.findIndex(element => element.uniqueID === parentId);

    if (textArea.value !== '') {
        toDoData[index].toDoValue = textArea.value;
    } else {
        toDoData.splice(index, 1);
    }

    localStorage.setItem('toDoData', JSON.stringify(toDoData));
    textArea.removeEventListener('input', saveListItem);
}

function saveCheckboxes(checkbox) {
    const parentId = checkbox.parentElement.id;
    const index = toDoData.findIndex(element => element.uniqueID === parentId);

    if (checkbox.checked) {
        toDoData[index].toDoChecked = true;
    } else {
        toDoData[index].toDoChecked = false;
    }

    localStorage.setItem('toDoData', JSON.stringify(toDoData));
    checkbox.removeEventListener('change', saveCheckboxes);
}


function removeElementIfClicked(button) {
    const parentId = button.parentElement.id;
    const index = toDoData.findIndex(element => element.uniqueID === parentId);

    const parent = button.parentElement;

    parent.querySelectorAll('.child').forEach(child => {
        child.remove()
    });
    parent.remove();

    toDoData.splice(index, 1);
    localStorage.setItem('toDoData', JSON.stringify(toDoData));

    button.removeEventListener('click', removeElementIfClicked);
}

window.addEventListener('DOMContentLoaded', initialize);

