
module.exports = function () {
    const range = document.querySelector('.range-selector'),
        rangeField = document.querySelector('.range-selector__value'),
        startValue = range.value,
        maxVal = range.getAttribute('max'),
        minVal = range.getAttribute('min');

    let x = (startValue / (maxVal - minVal) - 0.2) * 100
    let color = 'linear-gradient(90deg, rgb(47,147,254)' + x + '% , rgb(229, 229, 229)' + x + '%)';

    range.style.background = color;
    
    range.addEventListener('change', (e) => {
        console.log(e.target.value);
        rangeField.innerText = e.target.value + ' ядер';
    })
 
   
    

    range.addEventListener("input", function () {
        x = (range.value / (maxVal - minVal) - 0.2) * 100
        color = 'linear-gradient(90deg, rgb(47,147,254)' + x + '% , rgb(229, 229, 229)' + x + '%)';
        range.style.background = color;
    });
}