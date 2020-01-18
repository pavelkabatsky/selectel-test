import '@babel/polyfill';
import 'whatwg-fetch';

document.addEventListener('DOMContentLoaded', () => {
    let main = require('./main.js');
    let rangeStyle = require('./range-style.js');
    let forEachPolyfill = require('./forEachPolyfill.js');
    
    forEachPolyfill();
    main();
    rangeStyle();

})