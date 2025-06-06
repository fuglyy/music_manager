const db = require('../db/db').getConnection();

const MemberModel = {
    getAll(callback) {
        db.all('SELECT * FROM members', callback);
    },

    getById(id, callback) {
        db.get('SELECT * FROM members WHERE id = ?', [id], callback);
    },

    getByGroupId(groupID, callback) {
        db.all('SELECT * FROM members WHERE groupID = ?', [groupID], callback);
    },

    create(member, callback) {
        const { name, surname, instrument, role, joinDate, groupID } = member;
        db.run(
            'INSERT INTO members (name, surname, instrument, role, joinDate, groupID) VALUES (?, ?, ?, ?, ?, ?)',
            [name, surname, instrument, role, joinDate, groupID],
            function (err) {
                callback(err, { id: this.lastID, ...member });
            }
        );
    },

    update(id, member, callback) {
        const { name, surname, instrument, role, joinDate, groupID } = member;
        db.run(
            'UPDATE members SET name = ?, surname = ?, instrument = ?, role = ?, joinDate = ?, groupID = ? WHERE id = ?',
            [name, surname, instrument, role, joinDate, groupID, id],
            function (err) {
                callback(err, { id, ...member });
            }
        );
    },

    delete(id, callback) {
        db.run('DELETE FROM members WHERE id = ?', [id], callback);
    }
};

module.exports = MemberModel;
