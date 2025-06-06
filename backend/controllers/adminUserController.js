// controllers/adminUserController.js

const UserModel = require('../models/userModel');

exports.getAllUsers = (req, res) => {
  UserModel.getAll((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
};

exports.updateUserRole = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['guest', 'manager', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Недопустимая роль' });
  }

  UserModel.updateRole(id, role, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Роль обновлена', result });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  UserModel.deleteById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Пользователь удалён', result });
  });
};
