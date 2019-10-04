let global = [];
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

    const close_btn = document.getElementById('close');
    const close_btn2 = document.getElementById('close2'); // костыль ЫЫЫЫЫыы

    add_new_sets.addEventListener('click', () => { // Переключение страницы
        location.hash = 'addSet';
    });
    add_new_items.addEventListener('click', () => { // Переключение страницы
        location.hash = 'addItem';
    });
    close_btn.addEventListener('click', nullOfHash); // Переключение страницы
    close_btn2.addEventListener('click', nullOfHash); // Переключение страницы
    create_items_btn.addEventListener('click', () => { // Добавление нового предмета
        if(!duplicateCheck(document.getElementById('name_add_items').value)) {
            sendToStorage('item');
            location.hash = 'addSet';
        } else {
            notification('Смени имя');
        }
    });
    save_set_btn.addEventListener('click', () =>{
        
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
    } else if (location.hash === '#addItem') {
        document.getElementById('add_sets_page').style.display = 'none';
        document.getElementById('add_items_page').style.display = 'unset';
    } else if (location.hash === '#addSet') {
        document.getElementById('add_sets_page').style.display = 'unset';
        document.getElementById('add_items_page').style.display = 'none';
    } else if (localion.hash === '#addEffects') {
        
    }
});

const createItem = (text, checked) => {
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
            li.setAttribute('style', 'background-color: gray');
        } else {
            checkbox.setAttribute('src', 'img/todo-s.png');
        }
        checkbox.setAttribute('alt', 'checkbox');
        checkbox.style.cursor = 'pointer';
        checkbox.addEventListener('click', e => {
            let text = e.target.nextSibling.textContent;
            for (let i = 0; i < global.length; i++) {
                if (global[i].name === text) {
                    global[i].checked = !global[i].checked;
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
                if (global[i].name === text) {
                    global.splice(i, 1)
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
};

const sendToStorage = type => {
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
        global.push(obj);
        localStorage.setItem('data', JSON.stringify(global));
        updateDomFromGlobal(global);
        resetToDefault('item');
        notification('Успешно создал');   
    } else if (type === 'set') {
        //do it
    } else {
        localStorage.setItem('data', JSON.stringify(global));
        updateDomFromGlobal(global);
        resetToDefault('item');
        notification('Успешно');
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
    let haveItems = false;
    let haveSets = false;
    global.forEach(element => {
        console.log(element)
        if (element.type === 'item') {
            haveItems = true;
            document.getElementById('list_of_items').appendChild(createItem(element.name, element.checked));
        } else if (element.type === 'set') {
            haveSets = true;
            //do it
        }
    });
    haveItems ? console.log('Загружаю шмотки') : document.getElementById('list_of_items').appendChild(createItem('Пусто'));
    haveSets ? console.log('Загружаю сэты') : document.getElementById('list_of_sets').appendChild(createItem('Пусто'));
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
        document.getElementById('to4ka_add_items').value = 1;
        document.getElementById('damage_add_items').value = 1;
        document.getElementById('block_add_items').value = 1;
        document.getElementById('stan_add_items').value = 1;
        document.getElementById('yrod_add_items').value = 1;
        document.getElementById('chubby_add_items').value = 1;
        document.getElementById('hp_add_items').value = 1;
    } else if (page === 'set') {
        //do it
    }
};

const duplicateCheck = (text, type) => {
    let duplicate = false;
    global.forEach(element => {
        if (element.name === text) {
            duplicate = true;
        }
    });
    if (duplicate) {
        return true;
    } else {
        return false;
    }
}