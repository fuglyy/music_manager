const TourCityModel = require('../models/tourCityModel');

exports.getTourCities = (req, res) => {
  TourCityModel.getAll((err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
};

exports.getTourCitiesByTourId = (req, res) => {
  const tourID = parseInt(req.params.tourID);
  TourCityModel.getByTourId(tourID, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
};

exports.createTourCity = (req, res) => {
  const tourCity = req.body;
  if (!tourCity.tourID || !tourCity.cityID || !tourCity.date) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  TourCityModel.create(tourCity, (err, newEntry) => {
    if (err) res.status(500).json({ error: err.message });
    else res.status(201).json(newEntry);
  });
};

exports.deleteTourCity = (req, res) => {
  const id = parseInt(req.params.id);
  TourCityModel.delete(id, (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.status(204).send();
  });
};
