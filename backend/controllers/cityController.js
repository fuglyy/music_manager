const CityModel = require('../models/cityModel');

exports.getCities = (req, res) => {
    CityModel.getAll((err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};

exports.createCity = (req, res) => {
    const city = req.body;
    if (!city.name) {
        return res.status(400).json({ error: 'Название города обязательно' });
    }

    CityModel.create(city, (err, newCity) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(201).json(newCity);
    });
};
