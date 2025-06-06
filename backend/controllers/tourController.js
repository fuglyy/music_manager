const TourModel = require('../models/tourModel');
const TourCityModel = require('../models/tourCityModel');

exports.getTours = (req, res) => {
    TourModel.getAll((err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};

exports.getTourById = (req, res) => {
    const id = parseInt(req.params.id);
    TourModel.getById(id, (err, row) => {
        if (err) res.status(500).json({ error: err.message });
        else if (!row) res.status(404).json({ error: 'Гастроль не найдена' });
        else res.json(row);
    });
};

exports.createTour = (req, res) => {
    const tour = req.body;

    if (Array.isArray(tour.cities) && tour.cities.length > 0) {
        const total = tour.cities.reduce((sum, city) => sum + Number(city.ticketPrice), 0);
        tour.avgPrice = Math.round(total / tour.cities.length);
    }
    if (!tour.groupID || !tour.name || !tour.startDate || !tour.endDate || !tour.avgPrice) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    TourModel.create(tour, (err, newTour) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(201).json(newTour);
    });
};

exports.updateTour = (req, res) => {
    const id = parseInt(req.params.id);
    const tour = req.body;

    if (!tour.groupID || !tour.name || !tour.startDate || !tour.endDate || !tour.avgPrice) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    TourModel.update(id, tour, (err, updatedTour) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(updatedTour);
    });
};

exports.deleteTour = (req, res) => {
    const id = parseInt(req.params.id);

    TourModel.delete(id, (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(204).send();
    });
};

exports.getToursByCity = (req, res) => {
    const city = req.params.city;

    TourModel.getByCity(city, (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};

exports.getTourWithCities = (req, res) => {
    const id = parseInt(req.params.id);
    
    TourModel.getById(id, (err, tour) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!tour) return res.status(404).json({ error: 'Тур не найден' });
  
      TourCityModel.getByTourId(id, (err, cities) => {
        if (err) return res.status(500).json({ error: err.message });
  
        res.json({
          ...tour,
          cities
        });
      });
    });
  };