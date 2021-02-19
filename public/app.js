import {
	add_user_to_game,
	change_username,
	show_notification,
	set_user_list,
	show_answers_button,
	show_answers,
	parts
} from './functions.js';

const socket = io(); // eslint-disable-line

const set_username_button = document.querySelector('#set_username > button');

const start_button = document.querySelector('#start');

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
	const button = show_answers_button();

	button.addEventListener('click', (event) => {
		event.preventDefault();

		socket.emit('show_answers', null);
	});

	current_game = data.game.id;
	game[current_game] = data.game;
});

socket.on('turn_start', () => {
	show_notification('your turn to start the game!', -1);
});

socket.on('turn_continue', (data) => {
	show_notification(`your turn to fill ${parts[data.part]}`, -1);
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

	show_notification(`new user joined: ${username}`, 0);

	set_user_list(data.users);
});
