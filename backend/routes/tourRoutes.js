const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

router.get('/tours', tourController.getTours);
router.get('/tours/city/:city', tourController.getToursByCity);
router.get('/tours/:id', tourController.getTourById);
router.post('/tours', tourController.createTour);
router.put('/tours/:id', tourController.updateTour);
router.delete('/tours/:id', tourController.deleteTour);
router.get('/tours/:id/full', tourController.getTourWithCities);

module.exports = router;