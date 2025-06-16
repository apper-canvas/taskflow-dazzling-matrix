import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { taskService, listService } from '@/services';
import Button from '@/components/atoms/Button';
import PrioritySelector from '@/components/molecules/PrioritySelector';
import DatePicker from '@/components/molecules/DatePicker';

const QuickAddModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedList, setSelectedList] = useState('work');
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLists();
    }
  }, [isOpen]);

  const loadLists = async () => {
    try {
      const result = await listService.getAll();
      setLists(result);
      if (result.length > 0) {
        setSelectedList(result[0].Id);
      }
    } catch (err) {
      toast.error('Failed to load lists');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await taskService.create({
        title: title.trim(),
        priority,
        dueDate: dueDate || null,
        listId: selectedList
      });
      
      // Reset form
      setTitle('');
      setPriority('medium');
      setDueDate('');
      
      // Dispatch event to refresh task list
      window.dispatchEvent(new CustomEvent('taskCreated'));
      
      toast.success('Task created successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onKeyDown={handleKeyDown}
          >
            <div className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-xl text-gray-900">
                  Quick Add Task
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    autoFocus
                  />
                </div>

                {/* Priority and Due Date Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <PrioritySelector
                      value={priority}
                      onChange={setPriority}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <DatePicker
                      value={dueDate}
                      onChange={setDueDate}
                    />
                  </div>
                </div>

                {/* List Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    List
                  </label>
                  <select
                    value={selectedList}
                    onChange={(e) => setSelectedList(e.target.value)}
                    className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  >
                    {lists.map((list) => (
                      <option key={list.Id} value={list.Id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!title.trim() || loading}
                    loading={loading}
                    className="flex-1"
                  >
                    Create Task
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickAddModal;