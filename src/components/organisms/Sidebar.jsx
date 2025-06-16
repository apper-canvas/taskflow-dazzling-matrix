import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { listService, taskService } from '@/services';
import ListItem from '@/components/molecules/ListItem';
import CreateListModal from '@/components/organisms/CreateListModal';
import LoadingState from '@/components/atoms/LoadingState';
import ErrorState from '@/components/atoms/ErrorState';

const Sidebar = ({ onItemClick }) => {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateList, setShowCreateList] = useState(false);
  const [selectedListId, setSelectedListId] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [listsResult, tasksResult] = await Promise.all([
        listService.getAll(),
        taskService.getAll()
      ]);
      setLists(listsResult);
      setTasks(tasksResult);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (listData) => {
    try {
      const newList = await listService.create(listData);
      setLists(prev => [...prev, newList]);
      setShowCreateList(false);
      toast.success('List created successfully');
    } catch (err) {
      toast.error('Failed to create list');
    }
  };

  const getTaskCount = (listId) => {
    if (listId === 'all') {
      return tasks.filter(task => !task.completed).length;
    }
    return tasks.filter(task => task.listId === listId && !task.completed).length;
  };

  const handleListClick = (listId) => {
    setSelectedListId(listId);
    // Dispatch custom event to update main view
    window.dispatchEvent(new CustomEvent('listChanged', { detail: { listId } }));
    if (onItemClick) onItemClick();
  };

  if (loading) {
    return (
      <div className="p-4">
        <LoadingState count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState 
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Lists */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {/* All Tasks */}
            <ListItem
              id="all"
              name="All Tasks"
              icon="Inbox"
              color="#64748b"
              count={getTaskCount('all')}
              isSelected={selectedListId === 'all'}
              onClick={() => handleListClick('all')}
            />

            {/* Custom Lists */}
            {lists.map((list) => (
              <ListItem
                key={list.Id}
                id={list.Id}
                name={list.name}
                icon={list.icon}
                color={list.color}
                count={getTaskCount(list.Id)}
                isSelected={selectedListId === list.Id}
                onClick={() => handleListClick(list.Id)}
              />
            ))}

            {/* Add New List Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateList(true)}
              className="w-full flex items-center space-x-3 p-3 text-gray-500 hover:text-gray-700 hover:bg-surface-50 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <ApperIcon name="Plus" size={12} />
              </div>
              <span className="font-medium">Add New List</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Create List Modal */}
      <CreateListModal
        isOpen={showCreateList}
        onClose={() => setShowCreateList(false)}
        onSubmit={handleCreateList}
      />
    </>
  );
};

export default Sidebar;