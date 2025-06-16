import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { taskService, listService } from '@/services';
import TaskCard from '@/components/molecules/TaskCard';
import LoadingState from '@/components/atoms/LoadingState';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedListId, setSelectedListId] = useState('all');
  const [filterCompleted, setFilterCompleted] = useState(false);

  useEffect(() => {
    loadData();
    
    // Listen for list changes and task creation
    const handleListChange = (e) => {
      setSelectedListId(e.detail.listId);
    };
    
    const handleTaskCreated = () => {
      loadData();
    };

    window.addEventListener('listChanged', handleListChange);
    window.addEventListener('taskCreated', handleTaskCreated);

    return () => {
      window.removeEventListener('listChanged', handleListChange);
      window.removeEventListener('taskCreated', handleTaskCreated);
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksResult, listsResult] = await Promise.all([
        taskService.getAll(),
        listService.getAll()
      ]);
      setTasks(tasksResult);
      setLists(listsResult);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by list
    if (selectedListId !== 'all') {
      filtered = filtered.filter(task => task.listId === selectedListId);
    }

    // Filter by completion status
    if (!filterCompleted) {
      filtered = filtered.filter(task => !task.completed);
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      // First by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by due date (soonest first)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      // Finally by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const getCurrentListName = () => {
    if (selectedListId === 'all') return 'All Tasks';
    const list = lists.find(l => l.Id === selectedListId);
    return list?.name || 'Tasks';
  };

  const filteredTasks = getFilteredTasks();
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-surface-200 rounded w-32"></div>
          </div>
          <LoadingState count={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <ErrorState 
            message={error}
            onRetry={loadData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display font-bold text-3xl text-gray-900">
              {getCurrentListName()}
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Progress indicator */}
              {totalCount > 0 && (
                <div className="text-sm text-gray-500">
                  {completedCount} of {totalCount} completed
                </div>
              )}
              
              {/* Filter toggle */}
              <button
                onClick={() => setFilterCompleted(!filterCompleted)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  filterCompleted 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                }`}
              >
                <ApperIcon 
                  name={filterCompleted ? "Eye" : "EyeOff"} 
                  size={16} 
                />
                <span className="text-sm">
                  {filterCompleted ? 'Show All' : 'Hide Completed'}
                </span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {totalCount > 0 && (
            <div className="w-full bg-surface-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                className="bg-gradient-to-r from-semantic-success to-green-400 h-2 rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            title={tasks.length === 0 ? "No tasks yet" : "All caught up!"}
            description={
              tasks.length === 0 
                ? "Create your first task to get started with TaskFlow"
                : filterCompleted 
                  ? "All tasks are completed. Great job!"
                  : "No pending tasks found"
            }
            actionLabel="Create Task"
            onAction={() => {
              // Trigger quick add modal
              const quickAddBtn = document.querySelector('[data-quick-add]');
              if (quickAddBtn) quickAddBtn.click();
            }}
            icon="CheckCircle2"
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <TaskCard
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;