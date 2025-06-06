const db = require('../db/db').getConnection();

exports.getTopSongs = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT name, rating, groupID FROM songs ORDER BY rating DESC LIMIT 10', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.getComposerStats = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT composer, COUNT(*) as count
      FROM songs
      GROUP BY composer
      ORDER BY count DESC
      LIMIT 5
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.getSongYearsStats = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT year, COUNT(*) as count 
      FROM songs 
      GROUP BY year 
      ORDER BY year
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.refreshRatings = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id FROM songs', (err, rows) => {
      if (err) {
        return reject(err);
      }

      const updates = rows.map(({ id }) => {
        const randomRating = Math.floor(Math.random() * 100) + 1;
        return new Promise((resolveUpdate, rejectUpdate) => {
          db.run('UPDATE songs SET rating = ? WHERE id = ?', [randomRating, id], (err) => {
            if (err) rejectUpdate(err);
            else resolveUpdate();
          });
        });
      });

      Promise.all(updates)
        .then(() => resolve())
        .catch(reject);
    });
  });
};

