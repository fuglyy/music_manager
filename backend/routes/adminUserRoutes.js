const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const { authMiddleware, roleMiddleware } = require('../middleware/middleware');

router.use(authMiddleware); // проверка токена
router.use(roleMiddleware(['admin'])); // доступ только для админа

router.get('/', adminUserController.getAllUsers);
router.put('/:id/role', adminUserController.updateUserRole);
router.delete('/:id', adminUserController.deleteUser);

module.exports = router;
