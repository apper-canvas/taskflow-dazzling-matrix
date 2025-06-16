import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PriorityBadge from '@/components/atoms/PriorityBadge';

const PrioritySelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const priorities = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const selectedPriority = priorities.find(p => p.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
      >
        <PriorityBadge priority={value} />
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-surface border border-surface-200 rounded-lg shadow-lg z-20"
          >
            {priorities.map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => {
                  onChange(priority.value);
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 hover:bg-surface-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <PriorityBadge priority={priority.value} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default PrioritySelector;