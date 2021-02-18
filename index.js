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

let users = [];
let game_id = 1;
let game_idx = 1;

io.on('connection', (socket) => {
	socket.username = uuid.v4();

	users.push(socket.username);

	io.emit('new_user', {
		username: socket.username,
		users
	});

	socket.on('disconnect', () => {
		users = users.filter((user) => user !== socket.username);
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
			games[game_idx] =  {
				id: game_id,
				index: game_idx
			};

			io.emit('new_game_id', {
				game: games[game_idx]
			});

			game_id ++;
		}
	});

	socket.on('who', (data) => {
		if (! games[game_idx].answers) {
			games[game_idx].answers = {};
		}

		games[game_idx].answers.who = data.value;
	});

	socket.on('with', (data) => {
		if (! games[game_idx].answers) {
			games[game_idx].answers = {};
		}

		games[game_idx].answers.with = data.value;
	});

	socket.on('where', (data) => {
		if (! games[game_idx].answers) {
			games[game_idx].answers = {};
		}

		games[game_idx].answers.where = data.value;
	});

	socket.on('doing', (data) => {
		if (! games[game_idx].answers) {
			games[game_idx].answers = {};
		}

		games[game_idx].answers.doing = data.value;
	});

	socket.on('show_answers', () => {
		io.emit('answers', games[game_idx]);
	});
});
