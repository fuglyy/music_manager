const db = require('../db/db').getConnection();

const TourCityModel = {
  getAll(callback) {
    db.all(`
      SELECT tc.*, t.name AS tourName, c.name AS cityName
      FROM tourCities tc
      JOIN tours t ON tc.tourID = t.id
      JOIN cities c ON tc.cityID = c.id
    `, callback);
  },

  getByTourId(tourID, callback) {
    db.all(`
      SELECT tc.*, c.name AS cityName
      FROM tourCities tc
      JOIN cities c ON tc.cityID = c.id
      WHERE tc.tourID = ?
    `, [tourID], callback);
  },

  create(tourCity, callback) {
    const { tourID, cityID, date, ticketPrice } = tourCity;
    db.run(
      'INSERT INTO tourCities (tourID, cityID, date, ticketPrice) VALUES (?, ?, ?, ?)',
      [tourID, cityID, date, ticketPrice],
      function (err) {
        if (err) return callback(err);
  
        // Пересчет средней цены
        db.get(
          'SELECT AVG(ticketPrice) AS avg FROM tourCities WHERE tourID = ?',
          [tourID],
          (avgErr, row) => {
            if (avgErr) return callback(avgErr);
            const avgPrice = row.avg || 0;
  
            db.run(
              'UPDATE tours SET avgPrice = ? WHERE id = ?',
              [avgPrice, tourID],
              (updateErr) => {
                callback(updateErr, { id: this.lastID, ...tourCity, avgPrice });
              }
            );
          }
        );
      }
    );
  },
  

  delete(id, callback) {
    db.get('SELECT tourID FROM tourCities WHERE id = ?', [id], (err, row) => {
      if (err) return callback(err);
      const tourID = row?.tourID;
      if (!tourID) return callback(new Error('Tour ID not found'));
  
      db.run('DELETE FROM tourCities WHERE id = ?', [id], (deleteErr) => {
        if (deleteErr) return callback(deleteErr);
  
        db.get(
          'SELECT AVG(ticketPrice) AS avg FROM tourCities WHERE tourID = ?',
          [tourID],
          (avgErr, avgRow) => {
            if (avgErr) return callback(avgErr);
  
            const avgPrice = avgRow.avg || 0;
            db.run(
              'UPDATE tours SET avgPrice = ? WHERE id = ?',
              [avgPrice, tourID],
              callback
            );
          }
        );
      });
    });
  }
  
};

module.exports = TourCityModel;
