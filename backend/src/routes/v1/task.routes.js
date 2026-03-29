const express = require('express');
const taskController = require('../../controllers/taskController');
const authMiddleware = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const { taskValidator } = require('../../middlewares/validate');

const router = express.Router();

// Apply auth middleware to all task routes
router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/tasks/all:
 *   get:
 *     summary: Get all tasks (Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks
 *       403:
 *         description: Forbidden - admin access required
 */
router.get('/all', roleMiddleware('admin'), taskController.getAllTasks);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks for the current user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's tasks
 */
router.get('/', taskController.getMyTasks);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, done]
 *                 default: pending
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', taskValidator, taskController.createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, done]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found or unauthorized
 */
router.put('/:id', taskValidator, taskController.updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task UUID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found or unauthorized
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;