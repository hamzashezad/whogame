const express = require('express');
const socket = require('socket.io');
const path = require('path');
const uuid = require('uuid');
const app = express();

// enable user count check
const COUNT_CHECK = true;

app.use(express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

const server = app.listen(3000);

const io = socket(server);

const games = [];

const parts = [
	'who',
	'with',
	'where',
	'doing'
];

let users = [];
let socket_ids = [];
let game_id = 0;

io.on('connection', (socket) => {
	socket.username = uuid.v4();

	users.push(socket.username);
	socket_ids.push(socket.id);

	io.emit('new_user', {
		username: socket.username,
		users
	});

	socket.on('disconnect', () => {
		users = users.filter((user) => user !== socket.username);
		socket_ids = socket_ids.filter((id) => id !== socket.id);
	});

	socket.on('set_username', (data) => {
		const old_username = socket.username;

		socket.username = data.username;

		io.emit('username_change', {
			old_username: old_username,
			username: socket.username
		});
	});

	socket.on('round_start', () => {
		const user_count = io.sockets.server.engine.clientsCount;

		if (COUNT_CHECK && user_count < 4) {
			socket.emit('insufficient_users', {
				message: `need ${4 - user_count} more users`
			});
		} else {
			games[game_id] = {
				id: game_id
			};

			const random = parseInt(Math.random() * 3);
			const temp_socket_ids = [...socket_ids];
			const temp_parts = [...parts];

			socket.to(socket_ids[random]).emit('turn_start', null);

			temp_socket_ids.splice(random, 1);
			temp_parts.splice(0, 1);

			for (let i = 0; i < 3; i ++) {
				if (socket.id == temp_socket_ids[i]) {
					socket.emit('turn_continue', {
						part: temp_parts[i]
					});
				} else {
					socket.to(temp_socket_ids[i]).emit('turn_continue', {
						part: temp_parts[i]
					});
				}
			}

			io.emit('new_game_id', {
				game: games[game_id]
			});
		}
	});

	socket.on('who', (data) => {
		if (! games[game_id].answers) {
			games[game_id].answers = {};
		}

		games[game_id].answers.who = data.value;
	});

	socket.on('with', (data) => {
		if (! games[game_id].answers) {
			games[game_id].answers = {};
		}

		games[game_id].answers.with = data.value;
	});

	socket.on('where', (data) => {
		if (! games[game_id].answers) {
			games[game_id].answers = {};
		}

		games[game_id].answers.where = data.value;
	});

	socket.on('doing', (data) => {
		if (! games[game_id].answers) {
			games[game_id].answers = {};
		}

		games[game_id].answers.doing = data.value;
	});

	socket.on('show_answers', () => {
		io.emit('answers', games[game_id]);

		game_id ++;
	});
});
