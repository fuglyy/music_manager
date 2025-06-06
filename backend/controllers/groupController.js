const GroupModel = require('../models/groupModel');
const SongModel = require('../models/songModel')
const TourModel = require('../models/tourModel')
const MemberModel = require('../models/memberModel')
const AlbumModel = require('../models/albumModel')

exports.getGroups = (req, res) => {
    GroupModel.getAll((err, rows) => {
        if (err) res.status(500).json({error: err.message});
        else res.json(rows);
    });
};

exports.getGroupById = (req, res) => {
    const id = parseInt(req.params.id);
    GroupModel.getById(id, (err, row) => {
        if (err) res.status(500).json({error: err.message});
        else if (!row) res.status(404).json({error: 'Группа не найдена'});
        else res.json(row);
    });
};

exports.createGroup = (req, res) => {
    const group =req.body;
    const ownerId = req.user.id;
    if (!group.name) {
        return res.status(400).json({ error: 'Название группы обязательно'});
    }

    GroupModel.create(group, ownerId, (err, newGroup) => {
        if (err) res.status(500).json({ error: err.message});
        else res.status(201).json(newGroup);
    });
};

exports.updateGroup = (req, res) => {
    const id = parseInt(req.params.id);
    const group = req.body;
    
    if (!group.name) {
        return res.status(400).json({ error: 'Название группы обязательно'});
    }

    GroupModel.update(id, group, (err, updatedGroup) => {
        if (err) res.status(500).json({ error: err.message});
        else res.json(updatedGroup);
    });
};

exports.deleteGroup = (req, res) => {
    const id = parseInt(req.params.id);
    
    GroupModel.delete(id, (err) => {
        if (err) res.status(500).json({ error: err.message});
        else res.status(204).send();
    });
};

exports.getGroupSongs = (req, res) => {
    const id = parseInt(req.params.id);
    
    SongModel.getByBandId(id, (err, rows) => {
        if (err) res.status(500).json({error: err.message});
        else res.json(rows);
    });
};

exports.getGroupTours = (req, res) => {
    const id = parseInt(req.params.id);
    
    TourModel.getByBandId(id, (err, rows) => {
        if (err) res.status(500).json({error: err.message});
        else res.json(rows);
    });
};

exports.getGroupMembers = (req, res) => {
    const id = parseInt(req.params.id);

    MemberModel.getByGroupId(id, (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};

exports.getGroupAlbums = (req, res) => {
    const id = parseInt(req.params.id);

    AlbumModel.getByGroupId(id, (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });

    
};

exports.getOwnerGroups = (req, res) => {
    const userId = parseInt(req.user.id);
    GroupModel.getByOwnerId(userId, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};


