const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/songs', songController.getSongs);
router.get('/songs/composer-stats', songController.getComposerStats);
router.get('/songs/composer/:composer', songController.getSongsByComposer);
router.get('/songs/singer/:singer', songController.getSongsBySinger);
router.get('/songs/:id', songController.getSongById);
router.post('/songs', songController.createSong);
router.put('/songs/:id', songController.updateSong);
router.delete('/songs/:id', songController.deleteSong);

module.exports = router;