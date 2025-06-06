const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { authMiddleware, roleMiddleware, canManageGroup } = require('../middleware/middleware');


router.get('/groups', groupController.getGroups);
router.get('/groups/:id', groupController.getGroupById);
router.get('/groups/:id/songs', groupController.getGroupSongs);
router.get('/groups/:id/tours', groupController.getGroupTours);
router.get('/groups/:id/members', groupController.getGroupMembers);  // Новый маршрут для участников
router.get('/groups/:id/albums', groupController.getGroupAlbums);
router.get('/my-groups', authMiddleware, groupController.getOwnerGroups);
router.post('/groups', authMiddleware, roleMiddleware(['manager', 'admin']), groupController.createGroup);
router.put('/groups/:id', authMiddleware, roleMiddleware(['manager', 'admin']), canManageGroup, groupController.updateGroup);
router.delete('/groups/:id', authMiddleware, roleMiddleware(['manager', 'admin']), canManageGroup, groupController.deleteGroup);

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Radiohead"
 *         country:
 *           type: string
 *           example: "Russia"
 *         year:
 *           type: integer
 *           example: 2014
 */
/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Управление музыкальными группами
 */

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Получить список всех групп
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 */

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Получить информацию о группе по ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID группы
 *     responses:
 *       200:
 *         description: Успешный ответ
 *       404:
 *         description: Группа не найдена
 */

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Создать новую группу
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - country
 *               - year
 *             properties:
 *               name:
 *                 type: string
 *                 example: Imagine Dragons
 *               country:
 *                 type: string
 *                 example: USA
 *               year:
 *                 type: integer
 *                 example: 2008
 *     responses:
 *       201:
 *         description: Группа успешно создана
 */

/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Обновить данные группы
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID группы
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - country
 *               - year
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Группа обновлена
 *       404:
 *         description: Группа не найдена
 */

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Удалить группу по ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID группы
 *     responses:
 *       204:
 *         description: Группа удалена
 *       404:
 *         description: Группа не найдена
 */


module.exports = router;