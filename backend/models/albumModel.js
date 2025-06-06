const db = require('../db/db').getConnection();

const AlbumModel = {
    getAll(callback) {
        db.all('SELECT * FROM albums', callback);
    },

    getById(id, callback) {
        db.get('SELECT * FROM albums WHERE id = ?', [id], callback);
    },

    getByGroupId(groupID, callback) {
        db.all('SELECT * FROM albums WHERE groupID = ?', [groupID], callback);
    },

    create(album, callback) {
        const { name, releaseDate, groupID } = album;
        db.run(
            'INSERT INTO albums (name, releaseDate, groupID) VALUES (?, ?, ?)',
            [name, releaseDate, groupID],
            function (err) {
                callback(err, { id: this.lastID, ...album });
            }
        );
    },

    update(id, album, callback) {
        const { name, releaseDate, groupID } = album;
        db.run(
            'UPDATE albums SET name = ?, releaseDate = ?, groupID = ? WHERE id = ?',
            [name, releaseDate, groupID, id],
            function (err) {
                callback(err, { id, ...album });
            }
        );
    },

    delete(id, callback) {
        db.run('DELETE FROM albums WHERE id = ?', [id], callback);
    }
};

module.exports = AlbumModel;
