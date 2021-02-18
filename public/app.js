import { add_user_to_game, change_username, show_notification, set_user_list, show_answers } from './functions.js';

const socket = io(); // eslint-disable-line

const set_username_button = document.querySelector('#set_username > button');

const start_button = document.querySelector('#start');

const show_answers_button = document.querySelector('#show_answers');

const who = document.querySelector('#who');
const who_button = document.querySelector('#who_button');
const with_ = document.querySelector('#with');
const with_button = document.querySelector('#with_button');
const where = document.querySelector('#where');
const where_button = document.querySelector('#where_button');
const doing = document.querySelector('#doing');
const doing_button = document.querySelector('#doing_button');

const game = [];

let current_game = null;

let username = null;

set_username_button.addEventListener('click', (event) =>  {
	event.preventDefault();

	socket.emit('set_username', {
		username: document.querySelector('#username').value
	});
});

start_button.addEventListener('click', (event) => {
	event.preventDefault();

	socket.emit('round_start', null);

	const tbody = document.querySelector('tbody');
	const tr = document.createElement('tr');
	const button = document.createElement('button');
	const td = document.createElement('td');

	button.addEventListener('click', (event) => {
		event.preventDefault();

		socket.emit('show_answers', null);
	});

	button.setAttribute('id', 'show_answers');
	button.textContent = 'Show answers';

	td.appendChild(button);
	tr.appendChild(td);
	tbody.appendChild(tr);
});

who_button.addEventListener('click', (event) => {
	event.preventDefault();

	socket.emit('who', {
		value: who.value
	});
});

with_button.addEventListener('click', (event) => {
	event.preventDefault();

	socket.emit('with', {
		value: with_.value
	});
});

where_button.addEventListener('click', (event) => {
	event.preventDefault();

	socket.emit('where', {
		value: where.value
	});
});

doing_button.addEventListener('click', (event) => {
	event.preventDefault();

	socket.emit('doing', {
		value: doing.value
	});
});

socket.on('new_game_id', (data) => {
	current_game = data.game.id;
	game[current_game] = {};
	game[current_game].id = data.game.id;
});

socket.on('answers', (data)  => {
	show_answers(data);
});

// user events
socket.on('insufficient_users', (data) => {
	show_notification(data.message, 1);
});

socket.on('username_change', (data) => {
	username = change_username(data);
});

socket.on('new_user', (data) => {
	username = add_user_to_game(data);

	show_notification(username, 0);

	set_user_list(data.users);
});
