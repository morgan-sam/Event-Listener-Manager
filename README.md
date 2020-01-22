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

https://rawcdn.githack.com/morgan-sam/Event-Listener-Manager/4f6303728e2c8bc53aecea44b30488470072b908/dist/index.html
