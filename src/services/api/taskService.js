import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(task => task.Id === parseInt(id, 10));
    return task ? { ...task } : null;
  },

  async getByListId(listId) {
    await delay(250);
    return tasks.filter(task => task.listId === listId).map(task => ({ ...task }));
  },

  async create(taskData) {
    await delay(300);
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      listId: taskData.listId || 'default',
      createdAt: new Date().toISOString(),
      order: tasks.filter(t => t.listId === (taskData.listId || 'default')).length
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(250);
    const index = tasks.findIndex(task => task.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = { ...tasks[index], ...updates };
    delete updatedTask.Id; // Prevent Id modification
    updatedTask.Id = tasks[index].Id; // Restore original Id
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(task => task.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    return { ...deletedTask };
  },

  async reorder(taskId, newOrder, newListId) {
    await delay(250);
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(taskId, 10));
    if (taskIndex === -1) throw new Error('Task not found');
    
    const task = tasks[taskIndex];
    const oldListId = task.listId;
    
    // Update task with new order and potentially new list
    task.order = newOrder;
    if (newListId) {
      task.listId = newListId;
    }
    
    // Reorder other tasks in the affected lists
    const affectedTasks = tasks.filter(t => 
      t.listId === oldListId || (newListId && t.listId === newListId)
    );
    
    affectedTasks.forEach(t => {
      if (t.Id !== task.Id) {
        if (t.listId === task.listId && t.order >= newOrder) {
          t.order++;
        } else if (t.listId === oldListId && t.order > task.order) {
          t.order--;
        }
      }
    });
    
    return [...tasks];
  }
};

export default taskService;