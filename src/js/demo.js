import * as elf from './index.js';

export const demoSelect = () => {
    document.getElementById('aboutBtn').addEventListener('click', function() {
        makeScreenActive('aboutScreen');
    });
    document.getElementById('howToUseBtn').addEventListener('click', function() {
        makeScreenActive('howToUseScreen');
    });
    document.getElementById('demoBtn').addEventListener('click', function() {
        makeScreenActive('demoScreen');
    });
    document.getElementById('tutorialBtn').addEventListener('click', function() {
        makeScreenActive('tutorialScreen');
    });

    function makeScreenActive(className) {
        let screens = [...document.getElementsByClassName("screen")];
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementsByClassName(className)[0].classList.add('active');
    }
};

(function initDemo() {
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
            category += ' demo';

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
            updateEventListenerInfo('demo');
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
            updateEventListenerInfo('demo');
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
            updateEventListenerInfo('demo');
        });

    document
        .getElementById('deleteEventListenersByCategoryBtn')
        .addEventListener('click', function() {
            let category = prompt(
                'Enter a category of event listeners to delete:',
            );
            elf.deleteEventListenerByCategory(category);
            updateEventListenerInfo('demo');
        });
    document
        .getElementById('deleteDocumentEventListenersBtn')
        .addEventListener('click', function() {
            elf.deleteDocumentEventListeners();
            updateEventListenerInfo('demo');
        });

    document
        .getElementById('clearMessagesBtn')
        .addEventListener('click', function() {
            document.getElementById('messages').innerHTML = '';
        });
})();

(function initTutorial() {
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
        setCodeInputText(string);
    }

    function addFunctionToCodeInput(evt) {
        let codeInput = getCodeValue();
        let inputValue = evt.target.value;
        if (inputValue.match(/^\./g)) {
            if (codeInput.match(/^document.getElementById\(\'[^)]+\'\)$/g)) {
                setCodeInputText(`${codeInput}${inputValue}`);
            } else {
                return null;
            }
        } else {
            setCodeInputText(inputValue);
        }
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
        let selectedElements = document.querySelectorAll(`.addCodeFuncButton`);
        selectedElements.forEach(btn => {
            document
                .getElementById(btn.id)
                .addEventListener('click', addFunctionToCodeInput);
        });
    })();

    function updateHashDropdownList() {
        let newListIDs = getListOfEventListenerIDs();
        let dropdown = document.getElementById('selectHashDropdown');
        dropdown.innerHTML = `<option value='hashkey'>Select Hashkey</option>`;
        newListIDs.forEach(
            hash =>
            (dropdown.innerHTML += `<option value='${hash}'>${hash}</option>`),
        );
    }

    function getRegexListHashkeys() {
        let regexHashList = regexAssignList
            .filter(function(regexListItem) {
                if (/hashkey/g.test(regexListItem)) {
                    return regexListItem;
                }
            })
            .toString();
        let hashKeyArray = regexHashList.match(
            /(?!g)(?!(hashkey))\b[^)|/]+\b/g,
        );
        return hashKeyArray;
    }

    function addToHashRegexList(addHashKey) {
        regexAssignList = regexAssignList.map(function(regexListItem) {
            if (/hashkey/g.test(regexListItem)) {
                let itemPlainText = regexListItem
                    .toString()
                    .replace(/(?:\b[\/g]+\b|[\/+])/g, '');
                regexListItem = new RegExp(`${itemPlainText}|${addHashKey}`);
            }
            return regexListItem;
        });
    }

    function updateHashList() {
        let regexList = getRegexListHashkeys();
        let stringList = JSON.stringify(regexList);
        let htmlSelectList = getListOfEventListenerIDs();
        let regex;
        htmlSelectList.forEach(function(htmlListItem) {
            regex = new RegExp(`${htmlListItem}`);
            if (!regex.test(stringList)) {
                addToHashRegexList(htmlListItem);
            }
        });
    }

    function getListOfEventListenerIDs() {
        let eventListenerIDs = [];
        let newList = elf.getEventListenerList();
        newList.forEach(el => eventListenerIDs.push(el.eventListenerID));
        return eventListenerIDs;
    }

    //Need to convert multiple category items down into individual categories
    //For instance 'message greeting alert' as a category must be stored as an array of length 3, not a single string
    function getAllActiveCategories() {
        let eventListeners = elf.getEventListenerList();
        let eventListenerCategories =
            eventListeners.map(function(el) {
                return (el.eventCategory).split(/ |\./g);
            });

        eventListenerCategories = [...new Set(eventListenerCategories.flat())];
        return eventListenerCategories;
    }

    function updateCategoryTable() {
        document
            .querySelector('.categoryTable')
            .querySelector('.tableBody').innerHTML = '';
        let categories = getAllActiveCategories();
        categories.forEach(el => addNewCategoryToTable(el));
    }

    function addNewCategoryToTable(category) {
        let removeCheckbox, andOperator;
        let table = document
            .querySelector('.categoryTable')
            .querySelector('.tableBody');
        table.innerHTML += `
        <tr>
            <td>${category}</td>
            <td><input type="checkbox" class="removeCheckbox"></td>
            <td><input type="checkbox" class="groupOneCheckbox"></td>
            <td><input type="checkbox" class="groupTwoCheckbox"></td>
            <td><input type="checkbox" class="groupThreeCheckbox"></td>
        </tr>`;
    }

    function convertTableHtmlToObj() {
        let table = document
            .querySelector('.categoryTable')
            .querySelector('.tableBody');
        let categoryObjectArray = [];
        for (let i = 0; i < table.rows.length; i++) {
            let tableRow = table.rows[i];
            let catObj = {};
            catObj['category'] = tableRow.cells[0].innerHTML;
            catObj['removeValue'] = tableRow.cells[1].firstChild.checked;
            catObj['groupOne'] = tableRow.cells[2].firstChild.checked;
            catObj['groupTwo'] = tableRow.cells[3].firstChild.checked;
            catObj['groupThree'] = tableRow.cells[4].firstChild.checked;
            categoryObjectArray.push(catObj);
        }
        return categoryObjectArray;
    }

    function convertCategoryObjToString(obj) {
        let categoryString;
        let removeString = '';
        let groupString = ['', '', ''];
        obj.forEach(function(el) {
            if (el.removeValue) {
                if (el.groupOne | el.groupTwo | el.groupThree) {
                    if (el.groupOne) {
                        groupString[0] += `${el.category}.`;
                    }
                    if (el.groupTwo) {
                        groupString[1] += `${el.category}.`;
                    }
                    if (el.groupThree) {
                        groupString[2] += `${el.category}.`;
                    }
                } else {
                    removeString += `${el.category} `;
                }
            }
        });
        removeString = formatInputCatString(removeString);
        groupString = groupString.map(function(el) {
            return formatOutputCatString(el);
        });
        groupString = [...new Set(groupString)].filter(ec => ec !== '')
        categoryString = [groupString.join(' '), removeString];
        categoryString = formatOutputCatString(categoryString.join(' '));
        return categoryString;
    }

    function formatInputCatString(input) {
        let output = input.trim();
        output = [...new Set(output.split(/\.|\ /g))];
        output = output.filter(ec => ec !== '').join(' ');
        return output;
    }

    function formatOutputCatString(input) {
        input = input.trim();
        let regex = new RegExp(/(^\.|^ )|( $|\.$)/g);
        let output = input.replace(regex, '');
        return output;
    }

    function addRemoveCategoriesToCode() {
        let categoryInput = convertCategoryObjToString(convertTableHtmlToObj());
        let codeInput = getCodeValue();
        if (codeInput.match(/^deleteEventListenerByCategory\(\'[^)]*\'\)$/g)) {
            codeInput = codeInput.replace(
                /\(\'[^)]*\'\)$/g,
                `('${categoryInput}')`,
            );
            setCodeInputText(codeInput);
        }
    }

    function assignCategoriesToCode() {
        let categoryAssign = formatInputCatString(getCategoryInput());
        let codeInput = getCodeValue();
        let regex = new RegExp(
            /^createEventListener\([^,]*,[^,]*,[^,]*,(\'[^')(]*\')\)$/g,
        );
        if (codeInput.match(regex)) {
            codeInput = codeInput.replace(
                /(\'[^')(]*\')\)$/g,
                `'${categoryAssign}')`,
            );
            setCodeInputText(codeInput);
        }
    }

    document.getElementById('runCodeBtn').addEventListener('click', function() {
        let code = getCodeValue();
        let createEventListener = elf.createEventListener;
        let deleteEventListenerByCategory = elf.deleteEventListenerByCategory;
        let deleteDocumentEventListeners = elf.deleteDocumentEventListeners;
        eval(code);
        updateEventListenerInfo('tutorial');
        updateHashDropdownList();
        updateHashList();
        updateCategoryTable();
    });

    document
        .getElementById('codeAddCategoriesToFunctionBtn')
        .addEventListener('click', addRemoveCategoriesToCode);

    document
        .getElementById('assignCategoryBtn')
        .addEventListener('click', assignCategoriesToCode);

    document
        .getElementById('removeEventListenerFunctionSelection')
        .addEventListener('click', function() {
            let textLength = (this.options[this.selectedIndex].text.length);
            this.style.width = `${textLength*0.63225}rem`;
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

    function getCategoryInput() {
        return document.getElementById('categoryAssignInput').value;
    }

    function setCodeInputText(string) {
        document.getElementById('codeInput').value = string;
    }

})();

function updateEventListenerInfo(screenType) {
    let listenerInfo = document.getElementById(
        `${screenType}EventListenerInfo`,
    );
    let string = JSON.stringify(filterDemoEventListeners(screenType))
        .replace(/},{/g, '}<br>{')
        .replace(/(?:\[|\])/g, '');
    let regexString = `([^A-Za-z0-9]+)(${screenType})([^A-Za-z0-9]+)`;
    let regex = new RegExp(regexString, 'g');
    let removedText = string.replace(regex, "$1$3")
    listenerInfo.innerHTML = removedText;
}

function filterDemoEventListeners(screenType) {
    let eventListeners = elf.getEventListenerList();
    let demoList = [],
        nonDemoList = [],
        objToPass = [];
    eventListeners.forEach(function(el) {
        let elString = JSON.stringify(el);
        if (elString.match(/([^A-Za-z0-9]+)(demo)([^A-Za-z0-9]+)/g)) {
            demoList.push(JSON.parse(elString));
        } else {
            nonDemoList.push(JSON.parse(elString));
        }
    });
    screenType === 'demo' ? objToPass = demoList : objToPass = nonDemoList;
    return objToPass;
}


window.func = filterDemoEventListeners;