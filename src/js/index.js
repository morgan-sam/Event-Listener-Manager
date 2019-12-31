import '../css/main.css';
import * as intervals from './intervals.js';

intervals.createInterval(
    function() {
        let button = document.getElementById('btn' + randomInt(1, 4));
        button.style.backgroundColor =
            '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    },
    'btnInterval',
    500,
);

[...document.querySelectorAll('.button')].forEach(function(button) {
    button.addEventListener(
        'click',
        () =>
            (function() {
                intervals.clearIntervals('btnInterval');
                [...document.querySelectorAll('.button')].forEach(function(
                    button,
                ) {
                    button.removeAttribute('style');
                });
            })(),
        false,
    );
});

function randomInt(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
