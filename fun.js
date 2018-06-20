const users = document.getElementById('users');

socket.on('getUsers', (data) => {
    data.sort((a, b) => Math.sign(b.score - a.score));

    users.innerHTML = '';

    data.forEach((item) => {
        const row = document.createElement('tr');

        row.setAttribute('data-uuid', item.username);
        row.setAttribute('data-score', item.score);

        row.innerHTML = `<td><img width="60" height="60" src="${item.avatar}" alt=""></td><td>${item.name}</td><td><span data-element="score" class="score">${item.score}</span></td>`;
        users.appendChild(row);
    });
});

let removeClassTimer = null;

function updateScore(id, direction) {
    clearTimeout(removeClassTimer);

    const item = document.querySelector(`[data-uuid="${id}"]`);

    if (item) {
        let burritos = parseInt(item.getAttribute('data-score'), 10);
        const scoreEl = item.querySelector('[data-element="score"]');
        const className = (direction === 'up') ? ' tada animated good' : ' shake animated bad';

        burritos = (direction === 'up') ? burritos + 1 : burritos - 1;

        item.setAttribute('data-score', burritos);
        scoreEl.innerHTML = burritos;
        scoreEl.className += className;

        removeClassTimer = setTimeout(() => {
            scoreEl.className = scoreEl.className.replace(className, '').trim();
        }, 1000);
    }
}

socket.on('GIVE', (data) => {
    updateScore(data, 'up');
});

socket.on('TAKE_AWAY', (data) => {
    updateScore(data, 'down');
});
