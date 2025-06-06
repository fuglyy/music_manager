const MemberModel = require('../models/memberModel');

exports.getMembers = (req, res) => {
    MemberModel.getAll((err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};

exports.getMemberById = (req, res) => {
    const id = parseInt(req.params.id);
    MemberModel.getById(id, (err, row) => {
        if (err) res.status(500).json({ error: err.message });
        else if (!row) res.status(404).json({ error: 'Участник не найден' });
        else res.json(row);
    });
};

exports.getMembersByGroupId = (req, res) => {
    const groupID = parseInt(req.params.groupID);
    MemberModel.getByGroupId(groupID, (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
};

exports.createMember = (req, res) => {
    const member = req.body;
    if (!member.name) {
        return res.status(400).json({ error: 'Имя участника обязательно' });
    }

    MemberModel.create(member, (err, newMember) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(201).json(newMember);
    });
};

exports.updateMember = (req, res) => {
    const id = parseInt(req.params.id);
    const member = req.body;

    if (!member.name) {
        return res.status(400).json({ error: 'Имя участника обязательно' });
    }

    MemberModel.update(id, member, (err, updatedMember) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(updatedMember);
    });
};

exports.deleteMember = (req, res) => {
    const id = parseInt(req.params.id);

    MemberModel.delete(id, (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(204).send();
    });
};
