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
            let el = 'btn' + number;
            let string = prompt('Enter string to print on button press:');
            let category = prompt(
                'Enter category to place event (leave blank for none):',
            );

            if (document.getElementById(el) && string) {
                elf.createEventListener(
                    el,
                    'click',
                    function() {
                        document.getElementById(
                            'messages',
                        ).innerHTML += `${string}<br>`;
                    },
                    category,
                );
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
                    elementObj.deleteEventListener(hashkey);
                } catch (e) {
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
        .getElementById('deleteEventListenersByCategoryBtn')
        .addEventListener('click', function() {
            let category = prompt(
                'Enter a category of event listeners to delete:',
            );
            elf.deleteEventListenerByCategory(category);
            updateEventListenerInfo();
        });
    document
        .getElementById('deleteDocumentEventListenersBtn')
        .addEventListener('click', function() {
            elf.deleteDocumentEventListeners();
            updateEventListenerInfo();
        });

    document
        .getElementById('clearMessagesBtn')
        .addEventListener('click', function() {
            document.getElementById('messages').innerHTML = '';
        });

    function updateEventListenerInfo() {
        document.getElementById(
            'demoOneEventListenerInfo',
        ).innerHTML = JSON.stringify(elf.getEventListenerList()).replace(
            /},{/g,
            '}<br>{',
        );
    }
})();

(function initDemoTwo() {
    document
        .getElementById('codeNewEventListenerBtn')
        .addEventListener('click', function() {
            addTextToCode(
                `createEventListener('elementID','eventType',eventFunction,'eventCategory')`,
            );
        });
    document
        .getElementById('codeElementIDCallBtn')
        .addEventListener('click', function() {
            addTextToCode(`document.getElementById('elementID')`);
        });

    let regexAssignList = [
        /hashkey/g,
        /elementID|btnA|btnB|btnC/g,
        /eventType|click|mouseover/g,
        /eventFunction|\(\) => alert\([^)]+\)|\(\) => console.log\([^)]+\)/g,
        /eventCategory|Greeting|Message/g,
    ];

    function assignValueToCodeInput(evt) {
        let inputValue = evt.target.value;
        inputValue = inputValue.replace('text_value', getTextValue());
        let string = getCodeValue();
        regexAssignList.forEach(regex => {
            if (regex.test(inputValue)) {
                string = string.replace(regex, inputValue);
            }
        });
        addTextToCode(string);
    }

    function addFunctionToInput() {
        let codeInput = getCodeValue();
        let regexFuncList = [
            {
                rgx: /^document.getElementById\(\'[^)]+\'\)$/g,
                func: `.deleteEventListener('hashkey')`,
            },
        ];
        regexFuncList.forEach(regex => {
            if (regex.rgx.test(codeInput)) {
                codeInput += regex.func;
            }
        });
        addTextToCode(codeInput);
    }

    (function initELsOnAssignmentButtons() {
        let selectedElements = document.querySelectorAll(`.assignmentButton`);
        selectedElements.forEach(btn => {
            document
                .getElementById(btn.id)
                .addEventListener('click', assignValueToCodeInput);
        });
    })();

    (function initELsOnAddFuncButtons() {
        let selectedElements = document.querySelectorAll(`.addFuncButton`);
        selectedElements.forEach(btn => {
            document
                .getElementById(btn.id)
                .addEventListener('click', addFunctionToInput);
        });
    })();

    function updateHashDropdownList() {
        let eventListeners = elf.getEventListenerList();
        let eventListenerIDs = [];
        let dropdown = document.getElementById('selectHashDropdown');
        eventListeners.forEach(el => eventListenerIDs.push(el.eventListenerID));
        dropdown.innerHTML = `<option value='hashkey'>Select Hashkey</option>`;
        eventListenerIDs.forEach(
            hash =>
                (dropdown.innerHTML += `<option value='${hash}'>${hash}</option>`),
        );
        updateHashRegexList(eventListenerIDs);
        console.log(regexAssignList);
    }

    function updateHashRegexList(eventListenerIDs) {
        regexAssignList = regexAssignList.map(function(regexListItem) {
            if (/hashkey/g.test(regexListItem)) {
                let regexString = 'hashkey';
                eventListenerIDs.forEach(hash => (regexString += `|${hash}`));
                regexListItem = new RegExp(regexString);
            }
            return regexListItem;
        });
    }

    document.getElementById('runCodeBtn').addEventListener('click', function() {
        let code = getCodeValue();
        let createEventListener = elf.createEventListener;
        eval(code);
        updateEventListenerInfo();
        updateHashDropdownList();
    });

    document
        .getElementById('removeEventListenerFunctionSelection')
        .addEventListener('click', function() {
            showRemoveCodeInstructions(this.value);
        });

    function showRemoveCodeInstructions(selection) {
        let elements = document.querySelectorAll(
            '.removeByHashInstructions,.removeByElementInstructions,.removeByCategoryInstructions,.removeAllInstructions',
        );
        elements.forEach(el => el.classList.remove('active'));
        let selectedElements = document.querySelectorAll(`.${selection}`);
        selectedElements.forEach(el => el.classList.add('active'));
    }

    function getTextValue() {
        return document.getElementById('textInput').value;
    }

    function getCodeValue() {
        return document.getElementById('codeInput').value;
    }

    function addTextToCode(string) {
        document.getElementById('codeInput').value = string;
    }

    function updateEventListenerInfo() {
        document.getElementById(
            'demoTwoEventListenerInfo',
        ).innerHTML = JSON.stringify(elf.getEventListenerList()).replace(
            /},{/g,
            '}<br>{',
        );
    }
})();
