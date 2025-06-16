import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110 focus:ring-primary shadow-sm',
    secondary: 'bg-surface-100 text-gray-700 hover:bg-surface-200 focus:ring-surface-400 border border-surface-300',
    danger: 'bg-semantic-error text-white hover:bg-red-600 focus:ring-semantic-error',
    ghost: 'text-gray-600 hover:bg-surface-100 hover:text-gray-900 focus:ring-surface-400'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
      ) : icon ? (
        <ApperIcon name={icon} size={16} className="mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;