import '../css/main.css';

import * as demo from './demo.js';
import * as intervals from './intervals.js';

let eventListenerStorage = [];

export const createEventListener = (elementID, eventType, elementFunc) => {
    let el = document.getElementById(elementID);
    if (el) {
        let randID = Math.random()
            .toString(36)
            .slice(2);
        eventListenerStorage.push({
            elementID,
            eventType,
            elementFunc,
            eventListenerID: randID,
        });
        el.addEventListener(eventType, elementFunc);
        el.deleteEventListener = function deleteEventListener(delete_EL_ID) {
            let deleteEL = getEventListenerByHash(elementID, delete_EL_ID);
            el.removeEventListener(deleteEL.eventType, deleteEL.elementFunc);
            eventListenerStorage = eventListenerStorage.filter(
                obj => obj.eventListenerID !== deleteEL.eventListenerID,
            );
            updateEventListenerInfo();
        };
        el.deleteAllEventListeners = function deleteAllEventListeners() {
            let eventListeners = getElementEventListeners(elementID);
            eventListeners.forEach(evnList =>
                el.deleteEventListener(evnList.eventListenerID),
            );
            updateEventListenerInfo();
        };
        return randID;
    }
};

document
    .getElementById('newEventListenerBtn')
    .addEventListener('click', function() {
        let number = prompt(
            'Enter a number of button to add event listener to:',
        );
        let string = prompt('Enter string to print on button press:');
        let el = 'btn' + number;

        if (document.getElementById(el) && string) {
            createEventListener(el, 'click', function() {
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
        let elementObj = document.getElementById(element);
        if (elementObj) {
            try {
                let selected_EL_ID = getEventListenerByHash(element, hashkey)
                    .eventListenerID;
                elementObj.deleteEventListener(selected_EL_ID);
            } catch (e) {
                console.log(e);
                console.log(`No event listener with hash: ${hashkey}`);
            }
        }
        updateEventListenerInfo();
    });

function getEventListenerByHash(element, hashkey) {
    return getElementEventListeners(element).filter(
        el => el.eventListenerID === hashkey,
    )[0];
}

function getElementEventListeners(element) {
    return eventListenerStorage.filter(el => el.elementID === element);
}

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

demo.demoFunc();
