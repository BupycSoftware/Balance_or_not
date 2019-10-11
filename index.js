let global = []; // глобальный массив, в котором все объекты
let items = [];
let sets = [];
let effects = [];
window.addEventListener('load', () => {
    checkStorage(); // Проверяем локал сторэдж
    main(); // Запускаем выполнение основного скрипта
});

const main = () => {
    location.hash = '';
    const add_new_sets = document.getElementById('add_new_sets');
    const add_new_items = document.getElementById('add_new_items');
    const create_items_btn = document.getElementById('create_items_btn');
    const save_set_btn = document.getElementById('save_set_btn');
    const add_compare_btn = document.getElementById('add_compare_btn');
    const show_table_btn = document.getElementById('show_table_btn');

    const close_btn = document.getElementById('close');
    const close_btn2 = document.getElementById('close2'); // костыль ЫЫЫЫЫыы
    const close_btn3 = document.getElementById('close3'); // костыль ЫЫЫЫЫыы

    add_new_sets.addEventListener('click', () => { // Переключение страницы
        location.hash = 'addSet';
    });
    add_new_items.addEventListener('click', () => { // Переключение страницы
        location.hash = 'addItem';
    });
    close_btn.addEventListener('click', nullOfHash); // Переключение страницы
    close_btn2.addEventListener('click', nullOfHash); // Переключение страницы
    close_btn3.addEventListener('click', nullOfHash); // Переключение страницы

    create_items_btn.addEventListener('click', () => { // Создание предмета
        if (!duplicateCheck(document.getElementById('name_add_items').value, 'item')) {
            sendToStorage('item');
            location.hash = 'addSet';
        } else {
            notification('Смени имя');
        }
    });

    save_set_btn.addEventListener('click', () => { // Создание набора
        if (document.getElementById('text_sets').value) {
            if (!duplicateCheck(document.getElementById('text_sets').value, 'set')) {
                let arr = [];
                global.forEach(element => {
                    for (let i = 0; i < element.length; i++) {
                        if (element[i].type === 'item' && element[i].checked === true) {
                            arr.push(element[i]);
                        }
                    }
                });
                sendToStorage('set', arr);
                location.hash = '';
                removeChecked(items);
            } else {
                notification('Смени имя');
            }
        } else {
            notification('Введи имя');
        }
    });

    add_compare_btn.addEventListener('click', () => {
        let arr = [];
        for (let i = 0; i < global[1].length; i++) {
            if (global[1][i].checked === true) {
                arr.push(global[1][i]);
            }
        }
        console.log(arr);
        if (arr.length) {
            compare(arr);
            removeChecked(sets);
        } else {
            notification('Нужно выбрать хотя-бы 1 набор');
        }
    });
    
    show_table_btn.addEventListener('click', () => {
        location.hash = '#compareSets';
    });
};

const nullOfHash = () => {
    location.hash = '';
};

const checkStorage = () => {
    let storage_data = JSON.parse(localStorage.getItem('data'));
    console.log(storage_data);
    if (storage_data) {
        updateDomFromGlobal(storage_data);
    } else {
        document.getElementById('list_of_sets').appendChild(createItem('Пусто'));
        document.getElementById('list_of_items').appendChild(createItem('Пусто'));
    }
};

window.addEventListener('hashchange', () => { // Обработчик событий на изменение хэша страницы
    if (location.hash === '') {
        document.getElementById('add_sets_page').style.display = 'none';
        document.getElementById('add_items_page').style.display = 'none';
        document.getElementById('compare_wrapper').style.display = 'none';
    } else if (location.hash === '#addItem') {
        document.getElementById('add_sets_page').style.display = 'none';
        document.getElementById('add_items_page').style.display = 'unset';
    } else if (location.hash === '#addSet') {
        document.getElementById('add_sets_page').style.display = 'unset';
        document.getElementById('add_items_page').style.display = 'none';
    } else if (location.hash === '#addEffects') {
        
    } else if (location.hash === '#compareSets') {
        document.getElementById('compare_wrapper').style.display = 'unset';
    }
});

const createItem = (text, checked) => {
    if (text != 'table') {
        const li = document.createElement('li');
        const p = document.createElement('p');
        p.textContent = text;
        p.className = 'item_text';
        p.addEventListener('click', () => {
            //edit;
        });
        if (text !== 'Пусто') {
            const checkbox = document.createElement('img');
            if (checked) {
                checkbox.setAttribute('src', 'img/done-s.png');
                li.setAttribute('style', 'background-color: gray'); // поправить 
            } else {
                checkbox.setAttribute('src', 'img/todo-s.png');
            }
            checkbox.setAttribute('alt', 'checkbox');
            checkbox.style.cursor = 'pointer';
            checkbox.addEventListener('click', e => {
                let text = e.target.nextSibling.textContent;
                for (let i = 0; i < global.length; i++) {
                    for (let j = 0; j < global[i].length; j++) {
                        if (global[i][j].name === text) {
                            global[i][j].checked = !global[i][j].checked;
                        }
                    }
                }
                sendToStorage();
            });
            const remove = document.createElement('img');
            remove.setAttribute('src', 'img/remove-s.jpg');
            remove.setAttribute('alt', 'remove');
            remove.style.cursor = 'pointer';
            remove.addEventListener('click', e => {
                let text = e.target.previousSibling.textContent;
                for (let i = 0; i < global.length; i++) {
                    for (let j = 0; j < global[i].length; j++) {
                        if (global[i][j].name === text) {
                            global[i].splice(j, 1)
                        }
                    }
                }
                sendToStorage();
            });
            li.appendChild(checkbox);
            li.appendChild(p);
            li.appendChild(remove);
        } else {
            li.appendChild(p);
        }
        return li;
    } else {
        const tr = document.createElement('tr');
        for (let prop in checked) {
            const td = document.createElement('td');
            td.textContent = checked[prop];
            tr.appendChild(td);
        }
        return tr;
    }
};

const sendToStorage = (type, element) => {
    if (type === 'item') {
        const obj = {};
        obj.type = 'item';
        obj.name = document.getElementById('name_add_items').value;
        obj.slot = document.getElementById('items_type').value;
        obj.lvl = document.getElementById('lvl_add_items').value;
        obj.stil = document.getElementById('style_type_items').value;
        obj.tochno = document.getElementById('to4ka_add_items').value;
        obj.damage = document.getElementById('damage_add_items').value;
        obj.block = document.getElementById('block_add_items').value;
        obj.stan = document.getElementById('stan_add_items').value;
        obj.yrod = document.getElementById('yrod_add_items').value;
        obj.chubby = document.getElementById('chubby_add_items').value;
        obj.hp = document.getElementById('hp_add_items').value;
        obj.checked = 0;
        items.push(obj);
        deleteAndAdd(); // Перезаписываем всё дабы небыло случайных повторов
        updateDomFromGlobal(global); // Записываем в DOM данные с массива
        resetToDefault('item'); // Очищаем поля страницы
        notification('Успешно создал'); // Выводим уведомление
    } else if (type === 'set') {
        const obj = {};
        obj.name = document.getElementById('text_sets').value;
        obj.type = 'set';
        obj.stil = document.getElementById('style_type_sets').value;
        obj.lvl = document.getElementById('lvl_add_sets').value;
        obj.arr = element;
        sets.push(obj);
        deleteAndAdd(); // Перезаписываем всё дабы небыло случайных повторов
        updateDomFromGlobal(global); // Записываем в DOM данные с массива
        resetToDefault('set'); // Очищаем поля страницы
        notification('Успешно создал'); // Выводим уведомление
    } else {
        deleteAndAdd(); // Перезаписываем все дабы небыло повторов
        updateDomFromGlobal(global); // Записываем в DOM данные с массива
        resetToDefault('item'); // Очищаем поля страницы
        notification('Успешно'); // Выводим уведомление
    }
};

const notification = text => {
    const timer = 3000;
    const alertMsg = document.createElement('div');
    alertMsg.className = 'alertMsg';
    alertMsg.textContent = text;
    setTimeout(() => {
        document.body.removeChild(alertMsg);
    }, timer);
    document.body.appendChild(alertMsg);
};

const updateDomFromGlobal = storage_data => {
    clearAllLists();
    global = storage_data;
    items = global[0];
    sets = global[1];
    effects = global[2];
    let haveItems = false;
    let haveSets = false;
    let haveEffects = false;
    global.forEach(element => {
        for (let i = 0; i < element.length; i++) {
            console.log(element[i])
            if (element[i].type === 'item') {
                haveItems = true;
                document.getElementById('list_of_items').appendChild(createItem(element[i].name, element[i].checked));
            } else if (element[i].type === 'set') {
                haveSets = true;
                document.getElementById('list_of_sets').appendChild(createItem(element[i].name, element[i].checked));
            } else if (element[i].type === 'effect') {
                haveEffects = true;
                document.getElementById('list_of_effects').appendChild(createItem(element[i].name, element[i].checked));
            }
        }
    })
    haveItems ? console.log('Загружаю шмотки') : document.getElementById('list_of_items').appendChild(createItem('Пусто'));
    haveSets ? console.log('Загружаю сэты') : document.getElementById('list_of_sets').appendChild(createItem('Пусто'));
    //haveEffects ? console.log('Загружаю эффекты') : document.getElementById('list_of_effects').appendChild(createItem('Пусто'));
};

const clearAllLists = () => {
    const sets_ul = document.getElementById('list_of_sets');
    const items_ul = document.getElementById('list_of_items');
    while (sets_ul.lastChild) {
        sets_ul.removeChild(sets_ul.lastChild);
    }
    while (items_ul.lastChild) {
        items_ul.removeChild(items_ul.lastChild);
    }
};

const resetToDefault = page => {
    if (page === 'item') {
        document.getElementById('name_add_items').value = 'Test';
        document.getElementById('items_type').value = 1;
        document.getElementById('lvl_add_items').value = 1;
        document.getElementById('style_type_items').value = 1;
        document.getElementById('to4ka_add_items').value = 0;
        document.getElementById('damage_add_items').value = 0;
        document.getElementById('block_add_items').value = 0;
        document.getElementById('stan_add_items').value = 0;
        document.getElementById('yrod_add_items').value = 0;
        document.getElementById('chubby_add_items').value = 0;
        document.getElementById('hp_add_items').value = 0;
    } else if (page === 'set') {
        document.getElementById('text_sets').value = 'Test';
        document.getElementById('style_type_sets').value = 1;
        document.getElementById('lvl_add_sets').value = 1;
    }
};

const duplicateCheck = (text, type) => {
    let duplicate = false;
    global.forEach(element => {
        for (let i = 0; i < element.length; i++) {
            if (element[i].type === type && element[i].name === text) {
                duplicate = true;
            }
        }
    });
    if (duplicate) {
        return true;
    } else {
        return false;
    }
};

const deleteAndAdd = () => {
    global = [];
    global.push(items);
    global.push(sets);
    global.push(effects);
    localStorage.removeItem('data');
    localStorage.setItem('data', JSON.stringify(global));
};

const removeChecked = where => {
    where.forEach(element => {
        if (element.checked === true) {
            element.checked = !element.checked;
        }
    });
    deleteAndAdd(); // Перезаписываем всё дабы небыло случайных повторов
    updateDomFromGlobal(global); // Записываем в DOM данные с массива
};

const compare = items_arr => {
    items_arr.forEach(set => {
        let obj = {};
        obj[0] = set.name;
        obj[1] = set.lvl;
        obj[2] = 0;
        obj[3] = 0;
        obj[4] = 0;
        obj[5] = 0;
        obj[6] = 0;
        obj[7] = 0;
        obj[8] = 0;
        set.arr.forEach(el => {
            console.log(el);
            obj[2] += +el.tochno;
            obj[3] += +el.damage;
            obj[4] += +el.block;
            obj[5] += +el.stan;
            obj[6] += +el.yrod;
            obj[7] += +el.chubby;
            obj[8] += +el.hp;
        });
        document.getElementById('compare_table').appendChild(createItem('table', obj));
    });

}