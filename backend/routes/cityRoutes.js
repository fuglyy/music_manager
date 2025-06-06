const express = require('express');
const router = express.Router();
const CityController = require('../controllers/cityController');

router.get('/', CityController.getCities);
router.post('/', CityController.createCity);

module.exports = router;
