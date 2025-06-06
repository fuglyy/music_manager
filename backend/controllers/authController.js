const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const UserFactory = require('../factories/userFactory');

const SECRET = process.env.SECRET;

exports.register = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
        // Фиксируем роль как 'manager' при регистрации
        const userObj = UserFactory.createUser('manager', { username, password });
        UserModel.create(userObj, (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json(user);
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = (req, res) => {
    const {username, password } = req.body;
    UserModel.findByUsername(username, (err, user) => {
        if (err || !user) return res.status(400).json({ error: 'Неверные данные'});

        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) return res.status(401).json({ error: 'Неверные данные'});

            const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {expiresIn: '2h' });
            res.json({ token, user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }});
        });
    });
};


