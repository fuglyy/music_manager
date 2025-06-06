const AlbumModel = require('../models/albumModel');

exports.getAlbums = (req, res) => {
    AlbumModel.getAll((err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};

exports.getAlbumById = (req, res) => {
    const id = parseInt(req.params.id);
    AlbumModel.getById(id, (err, row) => {
        if (err) res.status(500).json({ error: err.message });
        else if (!row) res.status(404).json({ error: 'Альбом не найден' });
        else res.json(row);
    });
};

exports.getAlbumsByGroupId = (req, res) => {
    const groupID = parseInt(req.params.groupID);
    AlbumModel.getByGroupId(groupID, (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};

exports.createAlbum = (req, res) => {
    const album = req.body;
    if (!album.name) {
        return res.status(400).json({ error: 'Название альбома обязательно' });
    }

    AlbumModel.create(album, (err, newAlbum) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(201).json(newAlbum);
    });
};

exports.updateAlbum = (req, res) => {
    const id = parseInt(req.params.id);
    const album = req.body;

    if (!album.name) {
        return res.status(400).json({ error: 'Название альбома обязательно' });
    }

    AlbumModel.update(id, album, (err, updatedAlbum) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(updatedAlbum);
    });
};

exports.deleteAlbum = (req, res) => {
    const id = parseInt(req.params.id);

    AlbumModel.delete(id, (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(204).send();
    });
};
