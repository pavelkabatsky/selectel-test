

// import 'promise-polyfill';

module.exports = function() {
    
    const wrap = document.querySelector('.tariffs-cards');
    const loader = document.querySelector('.loader');
    const range = document.querySelector('.range-selector');
    let configurations = [];
    const checkboxes = document.querySelectorAll('.check__input');
    let checkFilter = [];
    
    // Получение данных c сервера
    const getData = () => {
        return window.fetch('https://api.jsonbin.io/b/5df3c10a2c714135cda0bf0f/1')
            .then( response => {
                if(response.status !== 200){
                    console.log('Looks like there was a problem. Status Code: ' +  response.status);  
                    return;  
                }
                const data = response.json();
                return data;
            })
            .catch(function(err) {  
                wrap.innerHTML = `<div class="connectError">Ошибка соединения</div>`
            });
    }
    getData().then( (data)=> {
        process(data);
    })

    let filters = {
        rangeValue : +range.value,
    
        // метод сортировки range
        filterByRange(data, rangeVal) {
            return data.filter( item => {
                let  procQ = item.cpu.cores * item.cpu.count;
                return procQ === rangeVal;
            })
        },
        // метод сортировки checkbox
        filterByCheckbox(data, checkFilter) {
            let filteredElements = [...data];
            
            checkFilter.forEach(item => {
                if( item === 'GPU') {
                    filteredElements = [...filteredElements.filter( item => {
                        return item.gpu
                    })]
                } else if( item === 'RAID' ) {
                    filteredElements = [...filteredElements.filter( item => {
                        return item.disk.count >= 2
                    })]
                } else if( item === 'SSD' ) {
                    filteredElements = [...filteredElements.filter( item => {
                        return item.disk.type === 'SSD'
                    })]
                }
            })
            return filteredElements;
        }
    }

    const process = (data) => {
        configurations = [...data];
        filterConfigs(configurations);
        loader.style.display = 'none';
    }

    // Пропуск полученных данных через фильтры 
    const filterConfigs = (configurations) => {
        // Первичная сортировка range 
        let newArr = filters.filterByRange(configurations, filters.rangeValue);
        render(newArr);
        
        // Cортировка при перетаскивании range
        range.addEventListener('change', function() {
            filters.rangeValue = +this.value;
            if(checkFilter.length) {
                let sortByBoxArr = filters.filterByCheckbox(configurations, checkFilter);
                let sortByRangeArr = filters.filterByRange(sortByBoxArr,filters.rangeValue);
                render(sortByRangeArr);
                return;
            }
            let sortByRangeArr = filters.filterByRange(configurations,filters.rangeValue);
            render(sortByRangeArr);
        })

        // Сортировка по чекбоксам
        checkboxes.forEach(item => {
            item.addEventListener('change', (e) => {
                if(item.checked) {
                    checkFilter = [...checkFilter, e.target.value];
                    let sortByRangeArr = filters.filterByRange(configurations,filters.rangeValue);
                    let sortByBoxArr = filters.filterByCheckbox(sortByRangeArr, checkFilter);
                    render(sortByBoxArr);
                } else {
                    checkFilter = [...checkFilter.filter(item => { 
                        return item != e.target.value;
                    })]
                    let sortByRangeArr = filters.filterByRange(configurations,filters.rangeValue);
                    
                    if(checkFilter.length) {
                        let sortByBoxArr = filters.filterByCheckbox(sortByRangeArr, checkFilter);
                        render(sortByBoxArr);
                        return;
                    }
                    render(sortByRangeArr);
                }
            })
        })
    }

    // Рендер отфильтрованного массива
    const render = (arr)=> {
        wrap.innerHTML = '';
        if(!arr.length) {
            wrap.innerHTML = '<div class="no-search-result">Нет результатов</div>'
        }
        arr.forEach(item => {
            const cardItem = document.createElement('div');
            cardItem.classList.add('tariffs-cards__item');
            cardItem.innerHTML =
                `<ul>
                    <li class="tariffs-cards__item-config"><span>${item.name}</span> ${item.cpu.count >=2 ? item.cpu.count + ' x ' : ''} ${item.cpu.name}, ${item.cpu.count * item.cpu.cores} ядер</li>
                    <li class="tariffs-cards__item-ram">${item.ram}</li>
                    <li class="tariffs-cards__item-hard">${item.disk.count >=2 ? item.disk.count + ' x ' : ''} ${item.disk.count} ГБ ${item.disk.type}</li>
                </ul>
                <div class="tariffs-cards__item-bottom">
                    <div class="tariffs-cards__item-price">${item.price / 100} ₽/месяц</div>
                    <a class="order-btn" href="https://selectel.ru/" target="_blanc"> Заказать</a>
                </div>`
            wrap.appendChild(cardItem);
        });
    }
}
