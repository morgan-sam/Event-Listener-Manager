import '../css/main.css';
import * as intervals from './intervals.js';

let eventListenerStorage = [];

function createEventListener(elementID, elFunc, eventListenerID) {
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
        el.deleteEventListener = function deleteEventListener() {
            el.removeEventListener('click', elFunc);
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
                console.log(string);
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
        let el = document.getElementById('btn' + number);

        if (el) {
            el.deleteEventListener();
        }
        updateEventListenerInfo();
    });

function updateEventListenerInfo() {
    document.getElementById('eventListenerInfo').innerHTML = JSON.stringify(
        eventListenerStorage,
    ).replace(/},{/g, '}<br>{');
}

function randomInt(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
