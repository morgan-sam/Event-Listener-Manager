import * as elf from './elf.js';
import {
    updateEventListenerInfo,
    filterEventListeners
} from './index.js';

export const initTutorial = () => {
    let regexAssignList = [
        /hashkey/g,
        /elementID|btnA|btnB|btnC/g,
        /eventType|click|mouseover/g,
        /eventFunction|\(\) => alert\([^)]+\)|\(\) => console.log\([^)]+\)/g
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
        let eventListeners = filterEventListeners('tutorial');
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
        categories.forEach(el => {
            if (el != 'demo' && el != 'tutorial') addNewCategoryToTable(el)
        });
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

    function addTutorialCategoryBeforeExecution(code) {
        //adds tutorial string before executing createEventListener()
        let regex = new RegExp(
            /^createEventListener\([^,]*,[^,]*,[^,]*,(\'[^')(]*\')\)$/g,
        );
        if (code.match(regex)) {
            code = code.replace(/(\'[^')(]*)(\'\))$/g, "$1 tutorial$2");
        }
        //adds .tutorial to each category before executing deleteEventListenerByCategory()
        regex = new RegExp(/^deleteEventListenerByCategory\(\'[^)]*\'\)$/g);
        if (code.match(regex)) {
            let catString = (/(?:\(\')((?:[^)]+)+)(?:\'\))$/g).exec(code)[1];
            let catArr = catString.split(' ').filter(ec => ec !== '');
            let modCatString = catArr.map(el => el += '.tutorial').join(' ');
            code = code.replace(/(\(\')([^)]*)(\'\))$/g, `$1${modCatString}$3`);
        }
        return code;
    }

    document.getElementById('runCodeBtn').addEventListener('click', function() {
        let code = getCodeValue();
        code = addTutorialCategoryBeforeExecution(code);
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

}