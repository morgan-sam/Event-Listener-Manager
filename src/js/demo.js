import * as elf from './index.js';

export const demoFunc = () => {
    let key = elf.createEventListener('btn1', 'click', () =>
        console.log('I am button 1!'),
    );
    document.getElementById('btn1').deleteEventListener(key);
};
