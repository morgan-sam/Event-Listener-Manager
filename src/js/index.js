import * as elf from './elf.js';
import '../css/main.css';
import * as demo from './demo.js';
import * as tutorial from './tutorial.js';

(function screenSelect() {
	document.getElementById('aboutBtn').addEventListener('click', function() {
		makeScreenActive('aboutScreen');
	});
	document.getElementById('howToUseBtn').addEventListener('click', function() {
		makeScreenActive('howToUseScreen');
	});
	document.getElementById('demoBtn').addEventListener('click', function() {
		updateEventListenerInfo('demo');
		makeScreenActive('demoScreen');
	});
	document.getElementById('tutorialBtn').addEventListener('click', function() {
		updateEventListenerInfo('tutorial');
		makeScreenActive('tutorialScreen');
	});

	function makeScreenActive(className) {
		let screens = [ ...document.getElementsByClassName('screen') ];
		screens.forEach((screen) => screen.classList.remove('active'));
		document.getElementsByClassName(className)[0].classList.add('active');
	}
})();

export const updateEventListenerInfo = (screenType) => {
	let listenerInfo = document.getElementById(`${screenType}EventListenerInfo`);
	let string = JSON.stringify(filterEventListeners(screenType)).replace(/},{/g, '}<br>{').replace(/(?:\[|\])/g, '');
	let regexString = `([^A-Za-z0-9]+)(${screenType})([^A-Za-z0-9]+)`;
	let regex = new RegExp(regexString, 'g');
	let removedText = string.replace(regex, '$1$3');
	listenerInfo.innerHTML = removedText;
};

export const filterEventListeners = (screenType) => {
	let eventListeners = elf.getEventListenerList();
	let matchList = [];
	eventListeners.forEach(function(el) {
		let elString = JSON.stringify(el);
		let regexString = `([^A-Za-z0-9]+)(${screenType})([^A-Za-z0-9]+)`;
		if (elString.match(new RegExp(regexString, 'g'))) {
			matchList.push(JSON.parse(elString));
		}
	});
	return matchList;
};

demo.initDemo();
tutorial.initTutorial();
