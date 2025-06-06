// scripts/createAdmin.js
const bcrypt = require('bcrypt');
const db = require('./db/db').getConnection();

const username = 'admin1';
const password = '123';
const role = 'admin';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) return console.error(err);

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (row) {
      console.log('Админ уже существует');
    } else {
      db.run(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hash, role],
        (err) => {
          if (err) console.error('Ошибка при создании админа:', err);
          else console.log('Администратор создан');
        }
      );
    }
  });
});
