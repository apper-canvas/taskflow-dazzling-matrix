import { motion } from 'framer-motion';

const LoadingState = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface rounded-lg p-4 shadow-sm"
        >
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-3/4"></div>
            <div className="h-4 bg-surface-200 rounded w-1/2"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingState;