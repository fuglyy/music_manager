const db = require('../db/db').getConnection();

const CityModel = {
    getAll(callback) {
        db.all('SELECT * FROM cities', callback);
    },

    create(city, callback) {
        const { name } = city;
        db.run(
            'INSERT INTO cities (name) VALUES (?)',
            [name],
            function (err) {
                callback(err, { id: this.lastID, name });
            }
        );
    }
};

module.exports = CityModel;
