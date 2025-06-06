const db = require('../db/db').getConnection();

const TourModel = {
    getAll(callback) {
        db.all(`SELECT * FROM tours`, callback);
    },

    getById(id, callback) {
        db.get(`SELECT * FROM tours WHERE id = ?`, [id], callback);
    },

    getByBandId(groupID, callback) {
    db.all(
      'SELECT * FROM tours WHERE groupID = ?',
      [groupID],
      (err, tours) => {
        if (err) return callback(err);

        if (!tours.length) return callback(null, []);

        // Получаем города для каждого тура
        let completed = 0;

        tours.forEach((tour, index) => {
          db.all(
            `SELECT tc.*, c.name AS cityName
             FROM tourCities tc
             JOIN cities c ON tc.cityID = c.id
             WHERE tc.tourID = ?`,
            [tour.id],
            (err, cities) => {
              if (err) return callback(err);

              tours[index].cities = cities;
              completed++;

              if (completed === tours.length) {
                callback(null, tours);
              }
            }
          );
        });
      }
    )},

    getByCity(city, callback) {
        db.all(`
            SELECT t.*, c.name AS city, tc.date, tc.ticketPrice 
            FROM tours t
            LEFT JOIN tourCities tc ON t.id = tc.tourID
            LEFT JOIN cities c ON tc.cityID = c.id
            WHERE c.name LIKE ?`, [`%${city}%`], callback);
    },

    create(tour, callback) {
        const { groupID, name, startDate, endDate, cities, avgPrice} = tour;
        db.run(
            'INSERT INTO tours (groupID, name, startDate, endDate, avgPrice) VALUES (?, ?, ?, ?, ?)',
            [groupID, name, startDate, endDate, avgPrice ],
            function (err) {
                if (err) return callback(err);
                const tourID = this.lastID;
                // Теперь добавляем города в таблицу tourCities
                if (cities && cities.length > 0) {
                    const placeholders = cities.map(() => '(?, ?, ?, ?)').join(',');
                    const values = cities.flatMap(city => [
                        tourID, city.cityID, city.date, city.ticketPrice
                    ]);
                    db.run(
                        `INSERT INTO tourCities (tourID, cityID, date, ticketPrice) VALUES ${placeholders}`,
                        values, 
                        function(err) {
                            callback(err, { id: tourID, ...tour });
                        });
                } else {
                    callback(err, { id: tourID, ...tour });
                }
            }
        );
    },

    update(id, tour, callback) {
        const { groupID, name, startDate, endDate, cities, avgPrice } = tour;
        db.run(
            'UPDATE tours SET groupID = ?, name = ?, startDate = ?, endDate = ?, avgPrice = ? WHERE id = ?',
            [groupID, name, startDate, endDate, avgPrice, id],
            function (err) {
                if (err) return callback(err);
                // Обновление городов
                db.run('DELETE FROM tourCities WHERE tourID = ?', [id], function (err) {
                    if (err) return callback(err);
                    if (cities && cities.length > 0) {
                        const placeholders = cities.map(() => '(?, ?, ?, ?)').join(',');
                        const values = cities.flatMap(city => [
                            id, city.cityID, city.date, city.ticketPrice
                        ]);
                        db.run(
                            `INSERT INTO tourCities (tourID, cityID, date, ticketPrice) VALUES ${placeholders}`,
                            values, 
                            function(err) {
                                callback(err, { id, ...tour });
                            });
                    } else {
                        callback(err, { id, ...tour });
                    }
                });
            }
        );
    },

    delete(id, callback) {
        db.run('DELETE FROM tours WHERE id = ?', [id], callback);
    }
};

module.exports = TourModel;
