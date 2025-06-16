import listData from '../mockData/lists.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let lists = [...listData];

const listService = {
  async getAll() {
    await delay(200);
    return [...lists];
  },

  async getById(id) {
    await delay(150);
    const list = lists.find(list => list.Id === parseInt(id, 10));
    return list ? { ...list } : null;
  },

  async create(listData) {
    await delay(300);
    const maxId = lists.length > 0 ? Math.max(...lists.map(l => l.Id)) : 0;
    const newList = {
      Id: maxId + 1,
      name: listData.name,
      color: listData.color || '#5B47E0',
      icon: listData.icon || 'List',
      order: lists.length
    };
    lists.push(newList);
    return { ...newList };
  },

  async update(id, updates) {
    await delay(250);
    const index = lists.findIndex(list => list.Id === parseInt(id, 10));
    if (index === -1) throw new Error('List not found');
    
    const updatedList = { ...lists[index], ...updates };
    delete updatedList.Id; // Prevent Id modification
    updatedList.Id = lists[index].Id; // Restore original Id
    
    lists[index] = updatedList;
    return { ...updatedList };
  },

  async delete(id) {
    await delay(200);
    const index = lists.findIndex(list => list.Id === parseInt(id, 10));
    if (index === -1) throw new Error('List not found');
    
    const deletedList = lists[index];
    lists.splice(index, 1);
    return { ...deletedList };
  }
};

export default listService;