import '../css/main.css';

import * as demo from './demo.js';

let eventListenerStorage = [];

//createEventListener allows you to create event listeners similar to how you would using addEventListener.
//cEL() has the same event type & function parameters, but differs in it not being attached to the element and instead requiring you to specify the id of the element to create the event listeners for. It also allows you to specify categories of event listeners that work similar to CSS classes, for easier grouping.

//Two functions are attached to the element on calling createEventListener: deleteEventListener & deleteAllEventListener. i.e: document.getElementById(elementID).deleteAllEventListeners();

//deleteEventListener allows you to remove a specific event listener from the element by providing the hash key that corresponds to that particular event listener. On calling the createEventListener function a hash key is returned, allowing it to be stored is a variable so that specific EL can be removed at a later point in execution.

//deleteAllEventListeners simply removes every event listener associated with the element. It does not require any arguments.

export const createEventListener = (
    elementID,
    eventType,
    elementFunc,
    eventCategory,
) => {
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
            eventCategory: eventCategory ? eventCategory : undefined,
        });
        el.addEventListener(eventType, elementFunc);
        el.deleteEventListener = function deleteEventListener(delete_EL_ID) {
            let deleteEL = getEventListenerByHash(elementID, delete_EL_ID);
            el.removeEventListener(deleteEL.eventType, deleteEL.elementFunc);
            eventListenerStorage = eventListenerStorage.filter(
                obj => obj.eventListenerID !== deleteEL.eventListenerID,
            );
        };
        el.deleteAllEventListeners = function deleteAllEventListeners() {
            let eventListeners = getElementEventListeners(elementID);
            eventListeners.forEach(evnList =>
                el.deleteEventListener(evnList.eventListenerID),
            );
        };
        return randID;
    }
};

//deleteEventListenerByCategory allows you to delete multiple event listeners by a user specified category.
//Categories work in the same way as CSS classes.
//If called with a single category, it will remove only those with that category.
//If called multiple categories it will remove all events only with all specified categories, irrespective of order.
//An EL with the categories 'main btn nav' will be removed if dELBC() is called with any of the following category arguments: 'main', 'nav', 'btn', 'main btn', 'btn nav', 'main nav', or 'main btn nav'. The order of each can be changed as long as each seperate word is present.

export const deleteEventListenerByCategory = category => {
    let regexString;
    let categories = category.split(' ');
    let categoryEvents = eventListenerStorage.filter(el => {
        for (let i = 0; i < categories.length; i++) {
            regexString = `((?! ))(\\b${categories[i]}\\b)`;
            if (!RegExp(regexString, 'g').test(el.eventCategory)) return false;
        }
        return true;
    });
    categoryEvents.forEach(el =>
        document
            .getElementById(el.elementID)
            .deleteEventListener(el.eventListenerID),
    );
};

//deleteDocumentEventListeners simply removes every single event listener on the page.

export const deleteDocumentEventListeners = () => {
    eventListenerStorage.forEach(el =>
        document
            .getElementById(el.elementID)
            .deleteEventListener(el.eventListenerID),
    );
};

function getEventListenerByHash(element, hashkey) {
    return getElementEventListeners(element).filter(
        el => el.eventListenerID === hashkey,
    )[0];
}

function getElementEventListeners(element) {
    return eventListenerStorage.filter(el => el.elementID === element);
}

export const getEventListenerList = () => {
    return eventListenerStorage;
};

demo.demoSelect();
