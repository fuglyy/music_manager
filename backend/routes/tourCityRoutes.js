const express = require('express');
const router = express.Router();
const tourCityController = require('../controllers/tourCityController');

router.get('/tourCities', tourCityController.getTourCities);
router.get('/tourCities/:tourID', tourCityController.getTourCitiesByTourId);
router.post('/tourCities', tourCityController.createTourCity);
router.delete('/tourCities/:id', tourCityController.deleteTourCity);

module.exports = router;
