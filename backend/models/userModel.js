const db = require('../db/db').getConnection();
const bcrypt = require('bcrypt');
const { getAll } = require('./groupModel');

const UserModel = {
    create(user, callback) {
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) return callback(err);
            db.run(
                `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
                [user.username, hash, user.role],
                function(err) {
                    callback(err, {id: this.lastID, username: user.username, role: user.role});
                }
            );
        });
    },

    findByUsername(username, callback) {
        db.get(`SELECT * FROM users WHERE username = ?`, [username], callback);
    },

    getAll(callback) {
        db.all(`SELECT id, username, role FROM users`, callback);
    },

    updateRole(id, role, callback) {
        db.run(`UPDATE users SET role = ? WHERE id = ?`, [role, id], function (err) {
        callback(err, { changes: this.changes });
        });
    },

    deleteById(id, callback) {
        db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        callback(err, { changes: this.changes });
        });
    }
};

module.exports = UserModel;