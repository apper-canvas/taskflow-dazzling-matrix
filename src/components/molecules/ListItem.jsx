import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ListItem = ({ id, name, icon, color, count, isSelected, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(id)}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
        isSelected
          ? 'bg-primary/10 border-l-4 border-primary'
          : 'hover:bg-surface-50 border-l-4 border-transparent'
      }`}
    >
      <div className="flex items-center space-x-3 min-w-0">
        <div 
          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          <ApperIcon name={icon} size={14} className="text-white" />
        </div>
        <span 
          className={`font-medium truncate ${
            isSelected ? 'text-primary' : 'text-gray-700'
          }`}
        >
          {name}
        </span>
      </div>
      
      {count > 0 && (
        <span 
          className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
            isSelected 
              ? 'bg-primary text-white' 
              : 'bg-surface-200 text-gray-600'
          }`}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
};

export default ListItem;