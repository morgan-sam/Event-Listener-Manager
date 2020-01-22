# E.L.M.
Event Listener Manager is a set of functions to track and simplify adding/removing event listeners.

Repository includes ELM, and the demo/tutorial.

To import ELM to your project, copy the elm.js file from the src/js folder into your own project folder.

Then use the following statement at the head of your javascript files to import ELM's functions:

```javascript
import {
    createEventListener,
    deleteEventListenerByCategory,
    deleteDocumentEventListeners,
    getEventListenerList
} from './path/to/file/elm.js';
```

To try out the demo/tutorial of ELM, please visit the following link (best viewed on chrome):

https://rawcdn.githack.com/morgan-sam/Event-Listener-Framework/0f1b6eae2e1f5c9635e20722b30023a4f1d9f1ab/dist/index.html
