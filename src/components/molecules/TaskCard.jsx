import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';
import PriorityBadge from '@/components/atoms/PriorityBadge';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      const updatedTask = await taskService.update(task.Id, {
        completed: !task.completed
      });
      onUpdate(updatedTask);
      
      if (!task.completed) {
        toast.success('Task completed! 🎉');
      }
    } catch (err) {
      toast.error('Failed to update task');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      const updatedTask = await taskService.update(task.Id, {
        title: editTitle.trim()
      });
      onUpdate(updatedTask);
      setIsEditing(false);
      toast.success('Task updated');
    } catch (err) {
      toast.error('Failed to update task');
      setEditTitle(task.title);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.Id);
        onDelete(task.Id);
        toast.success('Task deleted');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return { text: 'Today', isOverdue: false };
    }
    
    const isOverdue = isPast(date) && !task.completed;
    return {
      text: format(date, 'MMM d'),
      isOverdue
    };
  };

  const dueDate = formatDueDate(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: task.completed ? 0.5 : 1, 
        y: 0,
        scale: task.completed ? 0.95 : 1
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`bg-surface rounded-xl p-4 shadow-sm border hover:shadow-md transition-all ${
        task.completed ? 'border-surface-200' : 'border-surface-100'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleComplete}
          disabled={isCompleting}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-semantic-success border-semantic-success'
              : 'border-surface-300 hover:border-primary'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-white"
            >
              <ApperIcon name="Check" size={14} />
            </motion.div>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mb-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleEditSubmit}
                className="w-full font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0"
                autoFocus
              />
            </form>
          ) : (
            <h3
              onClick={() => setIsEditing(true)}
              className={`font-medium cursor-pointer break-words ${
                task.completed 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-900 hover:text-primary'
              }`}
            >
              {task.title}
            </h3>
          )}

          {/* Meta information */}
          <div className="flex items-center space-x-3 mt-2">
            <PriorityBadge priority={task.priority} />
            
            {dueDate && (
              <span 
                className={`text-xs px-2 py-1 rounded-full ${
                  dueDate.isOverdue
                    ? 'bg-semantic-error/10 text-semantic-error'
                    : 'bg-surface-100 text-gray-600'
                }`}
              >
                {dueDate.text}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-semantic-error hover:bg-semantic-error/10 rounded transition-colors"
          >
            <ApperIcon name="Trash2" size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;