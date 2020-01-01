import '../css/main.css';
import * as intervals from './intervals.js';

let eventListenerStorage = [];

function createEventListener(elementID, elFunc) {
    if (true) {
        let randID = Math.random()
            .toString(36)
            .slice(2);
        eventListenerStorage.push({
            elementID,
            elFunc,
            eventListenerID: randID,
        });
        let el = document.getElementById(elementID);
        el.addEventListener('click', elFunc);
        el.deleteEventListener = function deleteEventListener(deleteEL) {
            el.removeEventListener('click', deleteEL.elFunc);
            eventListenerStorage = eventListenerStorage.filter(
                obj => obj.eventListenerID != deleteEL.eventListenerID,
            );
            updateEventListenerInfo();
        };
    }
}

document
    .getElementById('newEventListenerBtn')
    .addEventListener('click', function() {
        let number = prompt(
            'Enter a number of button to add event listener to:',
        );
        let string = prompt('Enter string to print on button press:');
        let el = 'btn' + number;

        if (document.getElementById(el) && string) {
            createEventListener(el, function() {
                document.getElementById(
                    'messages',
                ).innerHTML += `${string}<br>`;
            });
        }
        updateEventListenerInfo();
    });

document
    .getElementById('deleteEventListenerBtn')
    .addEventListener('click', function() {
        let number = prompt(
            'Enter a number of button to delete event listener from:',
        );
        let hashkey = prompt('Enter the eventListenerID:');
        let element = 'btn' + number;
        let elementELs = eventListenerStorage.filter(
            el => el.elementID === element,
        );
        let selectedEL = elementELs.filter(
            el => el.eventListenerID === hashkey,
        )[0];
        if (selectedEL) {
            let el = document.getElementById(element);
            el.deleteEventListener(selectedEL);
        }
        updateEventListenerInfo();
    });

function updateEventListenerInfo() {
    document.getElementById('eventListenerInfo').innerHTML = JSON.stringify(
        eventListenerStorage,
    ).replace(/},{/g, '}<br>{');
}

document
    .getElementById('clearMessagesBtn')
    .addEventListener('click', function() {
        document.getElementById('messages').innerHTML = '';
    });

function randomInt(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
