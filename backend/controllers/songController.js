const SongModel = require('../models/songModel');

exports.getSongs = (req, res) => {
    SongModel.getAll((err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};

exports.getSongById = (req, res) => {
    const id = parseInt(req.params.id);
    SongModel.getById(id, (err, row) => {
        if (err) res.status(500).json({ error: err.message });
        else if (!row) res.status(404).json({ error: 'Песня не найдена' });
        else res.json(row);
    });
};

exports.createSong = (req, res) => {
    const song = req.body;

    if (!song.name) {
        return res.status(400).json({ error: 'Название песни обязательно' });
    }

    SongModel.create(song, (err, newSong) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(201).json(newSong);
    });
};

exports.updateSong = (req, res) => {
    const id = parseInt(req.params.id);
    const song = req.body;

    if (!song.name) {
        return res.status(400).json({ error: 'Название песни обязательно' });
    }

    SongModel.update(id, song, (err, updatedSong) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(updatedSong);
    });
};

exports.deleteSong = (req, res) => {
    const id = parseInt(req.params.id);
    SongModel.delete(id, (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(204).send();
    });
};

exports.getSongsByComposer = (req, res) => {
    const composer = req.params.composer;
    SongModel.getByComposer(composer, (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};

exports.getSongsBySinger = (req, res) => {
    const singer = req.params.singer;
    SongModel.getBySinger(singer, (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};

exports.getComposerStats = (req, res) => {
    SongModel.getComposerStats((err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};
