# Event-Listener-Framework
ELF - Framework to track and simplify adding/removing event listeners

Repository includes ELF, and demo/tutorial.

To import Event Listener Framework to your project, copy the elf.js file from the src/js/ folder and copy into your project folder.

Then use the following statement at the head of your javascript files to import elf's functions:

```javascript
import {
    createEventListener,
    deleteEventListenerByCategory,
    deleteDocumentEventListeners,
    getEventListenerList
} from './path/to/file/elf.js';
```

To try out the demo and tutorial of ELF, please visit:

https://rawcdn.githack.com/morgan-sam/Event-Listener-Framework/0f1b6eae2e1f5c9635e20722b30023a4f1d9f1ab/dist/index.html
