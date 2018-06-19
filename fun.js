const users = document.getElementById('users');

socket.on('getUsers', (data) => {
    data.sort((a, b) => Math.sign(b.score - a.score));

    users.innerHTML = '';

    data.forEach((item) => {
        const row = document.createElement('tr');

        row.innerHTML = `<td><img width="60" height="60" src="${item.avatar}" alt=""></td><td>${item.name}</td><td>${item.score}</td>`;
        users.appendChild(row);
    });
});
