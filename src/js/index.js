import '../css/main.css';

import * as demo from './demo.js';
import * as intervals from './intervals.js';

let eventListenerStorage = [];

export const createEventListener = (elementID, eventType, elementFunc, eventCategory) => {
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
            eventCategory
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

export const deleteEventListenerByCategory = (category) => {
    let categoryEvents = eventListenerStorage.filter(el => el.eventCategory === category);
    categoryEvents.forEach(el => document.getElementById(el.elementID).deleteEventListener(el.eventListenerID));
}

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
