export function add_user_to_game (data) {
	const user_list = document.querySelector('ul');
	const li = document.createElement('li');

	const username = data.username ? data.username : data;

	li.textContent = username;
	li.dataset.username = username;

	user_list.appendChild(li);

	return username;
}

export function change_username (data) {
	const users = document.querySelectorAll('li');

	let username = null;

	users.forEach((user) => {
		if (user.dataset.username == data.old_username) {
			username = data.username;
			user.textContent = username;
			user.dataset.username = username;
		}
	});

	return username;
}

export function show_notification (data, type) {
	const container = document.querySelector('#notification');
	const notification = document.createElement('div');

	notification.textContent = data;

	if (type > 0) {
		notification.classList.add('error');
	}

	if (type < 0) {
		notification.classList.add('info');
	}
	
	container.appendChild(notification);

	setTimeout(() => notification.remove(), 5000);
}

export function set_user_list (users) {
	const user_list = document.querySelector('ul');

	user_list.innerHTML = '';

	for (const user of users) {
		add_user_to_game(user);
	}
}

export function show_answers (data) {
	const tbody = document.querySelector('tbody');
	const rows = document.querySelectorAll('tr');
	const row = rows[rows.length - 1];
	const first_td = row.querySelector('td > button');
	const answers = sort_answers(data.answers);

	for (let p in answers) {
		const td = document.createElement('td');

		td.textContent = answers[p];

		row.appendChild(td);
	}

	tbody.appendChild(row);

	first_td.remove();
}

export const parts = {
	who: 'Who?',
	with: 'With whome?',
	where: 'Where?',
	doing: 'Doing what?'
};

function sort_answers (answers) {
	return {
		who: answers.who,
		with: answers.with,
		where: answers.where,
		doing: answers.doing
	};
}
