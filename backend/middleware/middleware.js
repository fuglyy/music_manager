const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const GroupModel = require('../models/groupModel');

// Проверка авторизации
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Требуется авторизация' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Токен не найден' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Неверный токен' });
    req.user = decoded;
    next();
  });
}

// Проверка роли
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Требуется авторизация' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }
    next();
  };
}

// Проверка управления группой
function canManageGroup(req, res, next) {
  const groupId = req.params.id;
  const user = req.user;

  GroupModel.getById(groupId, (err, group) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!group) return res.status(404).json({ error: 'Группа не найдена' });

    if (user.role === 'admin') {
      return next();
    }

    if (user.role === 'manager' && group.ownerId === user.id) {
      return next();
    }

    return res.status(403).json({ error: 'Доступ запрещен' });
  });
}

module.exports = { authMiddleware, roleMiddleware, canManageGroup };
