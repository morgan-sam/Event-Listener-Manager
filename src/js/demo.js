import * as elf from './index.js';

export const demoFunc = () => {
    let eventOneKey = elf.createEventListener('btn1', 'click', () =>
        console.log('The first message'),
    );
    let eventTwoKey = elf.createEventListener('btn1', 'click', () =>
        console.log('The second message'),
    );

    document.getElementById('btn1').deleteEventListener(eventOneKey);
    document.getElementById('btn1').deleteEventListener(eventTwoKey);
};
