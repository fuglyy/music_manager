const db = require('../db/db').getConnection();

const SongModel = {
    getAll(callback) {
        db.all(`SELECT songs.*, albums.name AS albumName, groups.name AS groupName
                FROM songs
                LEFT JOIN albums ON songs.albumID = albums.id
                LEFT JOIN groups ON songs.groupID = groups.id`
               , callback);
        },

        getById(id, callback) {
            db.get(`
                SELECT songs.*, albums.name AS albumName, groups.name AS groupName
                FROM songs
                LEFT JOIN albums ON songs.albumID = albums.id
                LEFT JOIN groups ON songs.groupID = groups.id
                WHERE songs.id = ?
            `, [id], callback);
        },
        
        getByBandId(groupID, callback) {
            db.all('SELECT * FROM songs WHERE groupID = ?', [groupID], callback);
        },
        
        getByComposer(composer, callback) {
            db.all('SELECT * FROM songs WHERE composer LIKE ?', [`%${composer}%`], callback);
        },
        
        getBySinger(singer, callback) {
            db.all('SELECT * FROM songs WHERE singer LIKE ?', [`%${singer}%`], callback);
        },
        
        create(song, callback) {
            const { name, composer, lyricist, year, singer, groupID, albumID } = song;
            db.run(
                'INSERT INTO songs (name, composer, lyricist, year, singer, groupID, albumID) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, composer, lyricist, year, singer, groupID, albumID || null],
                function (err) {
                    callback(err, { id: this.lastID, ...song });
                }
            );
        },
        
        update(id, song, callback) {
            const { name, composer, lyricist, year, singer, groupID, albumID } = song;
            db.run(
                'UPDATE songs SET name = ?, composer = ?, lyricist = ?, year = ?, singer = ?, groupID = ?, albumID = ? WHERE id = ?',
                [name, composer, lyricist, year, singer, groupID, albumID || null, id],
                function (err) {
                    callback(err, { id, ...song });
                }
            );
        },
        
        delete(id, callback) {
            db.run('DELETE FROM songs WHERE id = ?', [id], callback);
        },
        
        getComposerStats(callback) {
            db.all(`
                SELECT composer, COUNT(*) as count 
                FROM songs 
                GROUP BY composer 
                ORDER BY count DESC 
                LIMIT 5
            `, callback);
        }
};

module.exports = SongModel;