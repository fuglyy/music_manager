const express = require('express');
const router = express.Router();
const AlbumController = require('../controllers/albumController');

router.get('/albums', AlbumController.getAlbums);
router.get('/albums/:id', AlbumController.getAlbumById);
router.get('/groups/:groupID/albums', AlbumController.getAlbumsByGroupId);
router.post('/albums', AlbumController.createAlbum);
router.put('/albums/:id', AlbumController.updateAlbum);
router.delete('/albums/:id', AlbumController.deleteAlbum);

module.exports = router;
