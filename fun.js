const users = document.getElementById('users');
let store = [];
let lastStore = [];

let removeClassTimer = null;

socket.on('getUsers', (data) => {
    store = data;

    sortUsers();
    render();
});

function sortUsers() {
    store.sort((a, b) => Math.sign(b.score - a.score));

    store = store.map((item, i) => {
        const mappedItem = Object.assign({}, item);
        const position = i + 1;

        mappedItem.last_position = ('position' in mappedItem) ? mappedItem.position : 0;
        mappedItem.position = position;

        return mappedItem;
    });
}

function displayItem(element, wait, rerender) {
    setTimeout(() => {
        element.classList.add('display');

        setTimeout(() => {
            element.classList.add('displayed');

            if (rerender) {
                setTimeout(() => {
                    sortUsers();
                    render(true);
                }, 1000);
            }
        }, 300);
    }, wait);
}

function createElement(data, display) {
    const element = document.createElement('article');

    element.className = 'scoreboard__user';

    if (display) {
        element.className += ' display';
    }

    element.setAttribute('data-uuid', data.username);
    element.setAttribute('data-score', data.score);

    element.innerHTML = `<div><img width="60" height="60" src="${data.avatar}" alt=""></div><div>${data.name}</div><div><span data-element="score" class="score">${data.score}</span></div>`;

    return element;
}

function newPosition(element) {
    const newClass = ' pulse animated';
    element.className += newClass;

    setTimeout(() => {
        element.className = element.className.replace(newClass, '').trim();
    }, 1000);
}

function render(refresh) {
    const wait = 200;
    let currentWait = 0;

    users.innerHTML = '';

    store.forEach((item) => {
        currentWait += wait;

        const element = createElement(item, refresh);
        users.appendChild(element);

        if (refresh) {
            if (item.last_position !== item.position) {
                newPosition(element);
            }
        } else {
            displayItem(element, currentWait);
        }
    });
}

function appendUser(data) {
    store.push(data);

    const element = createElement(data);

    users.appendChild(element);

    displayItem(element, 200, true);
}

window.appendUser = appendUser;

function updateScore(data, direction) {
    const item = document.querySelector(`[data-uuid="${data.username}"]`);

    if (item) {
        const score = data.score;
        const scoreEl = item.querySelector('[data-element="score"]');
        const className = (direction === 'up') ? ' tada animated good' : ' shake animated bad';

        item.setAttribute('data-score', score);
        scoreEl.innerHTML = burritos;
        scoreEl.className += className;

        setTimeout(() => {
            scoreEl.className = scoreEl.className.replace(className, '').trim();

            setTimeout(() => {
                sortUsers();
                render(true);
            }, 1500);
        }, 1000);
    } else {
        appendUser(data);
    }
}

window.updateScore = updateScore;

socket.on('GIVE', (data) => {
    updateScore(data, 'up');
});

socket.on('TAKE_AWAY', (data) => {
    updateScore(data, 'down');
});
