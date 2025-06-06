const express = require('express')
const router = express.Router()
const analyticsController = require('../controllers/analyticsController')

router.get('/top-songs', analyticsController.getTopSongs)
router.get('/top-composers', analyticsController.getComposerStats)
router.get('/songs-by-year', analyticsController.getSongYearsStats)
router.post('/refresh-ratings', analyticsController.refreshRatings)


module.exports = router