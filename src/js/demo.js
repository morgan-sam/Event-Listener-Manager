import * as elf from './index.js';

import './index.js';

export const demoSelect = () => {
    document.getElementById('demoOneBtn').addEventListener('click', function() {
        //add demo one class
        makeScreenActive('demoScreenOne');
    });
    document.getElementById('demoTwoBtn').addEventListener('click', function() {
        //add demo two class
        makeScreenActive('demoScreenTwo');
    });

    function makeScreenActive(className) {
        let screens = document.querySelectorAll('[class*=demoScreen]');
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementsByClassName(className)[0].classList.add('active');
    }
};

(function initDemoOne() {
    document
        .getElementById('newEventListenerBtn')
        .addEventListener('click', function() {
            let number = prompt(
                'Enter a number of button to add event listener to:',
            );
            let string = prompt('Enter string to print on button press:');
            let el = 'btn' + number;

            if (document.getElementById(el) && string) {
                elf.createEventListener(el, 'click', function() {
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
                    let selected_EL_ID = getEventListenerByHash(
                        element,
                        hashkey,
                    ).eventListenerID;
                    elementObj.deleteEventListener(selected_EL_ID);
                } catch (e) {
                    console.log(e);
                    console.log(`No event listener with hash: ${hashkey}`);
                }
            }
            updateEventListenerInfo();
        });

    document
        .getElementById('deleteAllEventListenersBtn')
        .addEventListener('click', function() {
            let number = prompt(
                'Enter a number of button to delete all event listeners from:',
            );
            let element = 'btn' + number;
            let elementObj = document.getElementById(element);
            if (elementObj) {
                try {
                    elementObj.deleteAllEventListeners();
                } catch (e) {
                    console.log(e);
                }
            }
            updateEventListenerInfo();
        });

    document
        .getElementById('clearMessagesBtn')
        .addEventListener('click', function() {
            document.getElementById('messages').innerHTML = '';
        });

    function updateEventListenerInfo() {
        document.getElementById('demoOneEventListenerInfo').innerHTML = JSON.stringify(
            elf.getEventListenerList(),
        ).replace(/},{/g, '}<br>{');
    }
})();

(function initDemoTwo() {
    document
        .getElementById('codeNewEventListenerBtn')
        .addEventListener('click', function() {
            addTextToCode(
                `createEventListener('elementID','eventType',eventFunction)`,
            );
        });

    document.getElementById('assignBtnA').addEventListener('click', function() {
        let string = getInputValue();
        string = string.replace(/elementID|btnA|btnB|btnC/g, 'btnA');
        addTextToCode(string);
    });
    document.getElementById('assignBtnB').addEventListener('click', function() {
        let string = getInputValue();
        string = string.replace(/elementID|btnA|btnB|btnC/g, 'btnB');
        addTextToCode(string);
    });
    document.getElementById('assignBtnC').addEventListener('click', function() {
        let string = getInputValue();
        string = string.replace(/elementID|btnA|btnB|btnC/g, 'btnC');
        addTextToCode(string);
    });
    document
        .getElementById('assignEventTypeClick')
        .addEventListener('click', function() {
            let string = getInputValue();
            string = string.replace(/eventType|click|mouseover/g, 'click');
            addTextToCode(string);
        });
    document
        .getElementById('assignEventTypeMouseover')
        .addEventListener('click', function() {
            let string = getInputValue();
            string = string.replace(/eventType|click|mouseover/g, 'mouseover');
            addTextToCode(string);
        });
    document
        .getElementById('assignAlertEvent')
        .addEventListener('click', function() {
            let string = getInputValue();
            string = string.replace(
                /eventFunction|\(\) => alert\([^)]+\)|\(\) => console.log\([^)]+\)/g,
                `() => alert("${getTextValue()}")`,
            );
            addTextToCode(string);
        });

    document
        .getElementById('assignConsoleLogEvent')
        .addEventListener('click', function() {
            let string = getInputValue();
            string = string.replace(
                /eventFunction|\(\) => alert\([^)]+\)|\(\) => console.log\([^)]+\)/g,
                `() => console.log("${getTextValue()}")`,
            );
            addTextToCode(string);
        });

    document.getElementById('runCodeBtn').addEventListener('click', function() {
        let code = getInputValue();
        let createEventListener = elf.createEventListener;
        eval(code);
        updateEventListenerInfo();
    });
    function getTextValue() {
        return document.getElementById('textInput').value;
    }

    function getInputValue() {
        return document.getElementById('codeInput').value;
    }

    function addTextToCode(string) {
        document.getElementById('codeInput').value = string;
    }
    
    function updateEventListenerInfo() {
        document.getElementById('demoTwoEventListenerInfo').innerHTML = JSON.stringify(
            elf.getEventListenerList(),
        ).replace(/},{/g, '}<br>{');
    }
})();
