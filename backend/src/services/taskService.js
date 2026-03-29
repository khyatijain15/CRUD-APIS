const { Task, User } = require('../models');

const createTask = async (userId, taskData) => {
  return await Task.create({
    ...taskData,
    userId
  });
};

const getTasksByUser = async (userId) => {
  return await Task.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });
};

const getAllTasks = async () => {
  return await Task.findAll({
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }],
    order: [['createdAt', 'DESC']]
  });
};

const updateTask = async (taskId, userId, taskData) => {
  const task = await Task.findOne({ where: { id: taskId, userId } });
  
  if (!task) {
    throw new Error('Task not found or unauthorized');
  }

  await task.update(taskData);
  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOne({ where: { id: taskId, userId } });
  
  if (!task) {
    throw new Error('Task not found or unauthorized');
  }

  await task.destroy();
  return true;
};

module.exports = {
  createTask,
  getTasksByUser,
  getAllTasks,
  updateTask,
  deleteTask
};