const taskService = require('../services/taskService');
const { successResponse, errorResponse } = require('../utils/response');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return successResponse(res, { task }, 'Task created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByUser(req.user.id);
    return successResponse(res, { tasks }, 'Tasks retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks();
    return successResponse(res, { tasks }, 'All tasks retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
    return successResponse(res, { task }, 'Task updated successfully', 200);
  } catch (error) {
    if (error.message === 'Task not found or unauthorized') {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);
    return successResponse(res, null, 'Task deleted successfully', 200);
  } catch (error) {
    if (error.message === 'Task not found or unauthorized') {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

module.exports = {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTask,
  deleteTask
};