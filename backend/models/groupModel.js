const db = require('../db/db').getConnection();

const GroupModel = {
    getAll(callback) {
        db.all('SELECT * FROM groups', callback);
    },

    getById(id, callback) {
        db.get('SELECT * FROM groups WHERE id = ?', [id], callback);
    },

    create(group, ownerId, callback) {
        const { name, year, country} = group;
        db.run(
            'INSERT INTO groups (name, year, country, ownerId) VALUES (?, ?, ?, ?)',
            [name, year, country, ownerId],
            function (err) {
                callback(err, {id: this.lastID, ...group, ownerId});
            }
        );
    },

    update(id, group, callback) {
    const {name, year, country} = group;
    db.run(
        'UPDATE groups SET name = ?, year = ?, country = ? WHERE id = ?',
        [name, year, country, id],
        function (err) {
            if (err) {
                callback(err);
            } else if (this.changes === 0) {  // Если не обновлено ни одной записи
                callback(new Error('Группа не найдена'));
            } else {
                callback(null, {id, name, year, country});
            }
        }
    );
},




    delete(id, callback){
        db.run('DELETE FROM groups WHERE id = ?', [id], callback);
    },

    getMembers(groupID, callback) {
        MemberModel.getByGroupId(groupID, callback);
    },

    getAlbums(groupID, callback) {
        AlbumModel.getByGroupId(groupID, callback);
    },

    getByOwnerId(ownerId, callback) {
  db.all('SELECT * FROM groups WHERE ownerId = ?', [ownerId], callback);
}


};

module.exports = GroupModel;