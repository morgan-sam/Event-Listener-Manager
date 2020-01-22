import * as elm from './elm.js';
import { updateEventListenerInfo, filterEventListeners } from './index.js';

export const initDemo = () => {
	document.getElementById('newEventListenerBtn').addEventListener('click', function() {
		let number = prompt('Enter a number of button to add event listener to:');
		let el = 'btn' + number;
		let string = prompt('Enter string to print on button press:');
		let category = prompt('Enter category to place event (leave blank for none):');
		category += ' demo';

		if (document.getElementById(el) && string) {
			elm.createEventListener(
				el,
				'click',
				function() {
					document.getElementById('messages').innerHTML += `${string}<br>`;
				},
				category
			);
		}
		updateEventListenerInfo('demo');
	});

	document.getElementById('deleteEventListenerBtn').addEventListener('click', function() {
		let number = prompt('Enter a number of button to delete event listener from:');
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

	document.getElementById('deleteAllEventListenersBtn').addEventListener('click', function() {
		let number = prompt('Enter a number of button to delete all event listeners from:');
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

	document.getElementById('deleteEventListenersByCategoryBtn').addEventListener('click', function() {
		let category = prompt('Enter a category of event listeners to delete:');
		let catArr = category.split(' ').filter((ec) => ec !== '');
		let catString = catArr.map((el) => (el += '.demo')).join(' ');
		elm.deleteEventListenerByCategory(catString);
		updateEventListenerInfo('demo');
	});
	document.getElementById('deleteDocumentEventListenersBtn').addEventListener('click', function() {
		elm.deleteDocumentEventListeners();
		updateEventListenerInfo('demo');
	});

	document.getElementById('clearMessagesBtn').addEventListener('click', function() {
		document.getElementById('messages').innerHTML = '';
	});
};
