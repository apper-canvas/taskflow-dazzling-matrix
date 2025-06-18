import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import QuickAddModal from '@/components/organisms/QuickAddModal';
import { AuthContext } from '@/App';

const Header = ({ onToggleMobileMenu }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  return (
    <>
      <header className="flex-shrink-0 h-16 bg-surface border-b border-surface-200 px-4 lg:px-6 z-40">
        <div className="flex items-center justify-between h-full">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={18} className="text-white" />
              </div>
              <h1 className="font-display font-bold text-xl text-gray-900 hidden sm:block">
                TaskFlow Pro +
              </h1>
            </div>
          </div>

{/* Right side */}
          <div className="flex items-center space-x-3">
            {/* User info */}
            {isAuthenticated && user && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>Welcome, {user.firstName || user.emailAddress}</span>
              </div>
            )}
            
            {/* Quick add button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuickAdd(true)}
              className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:brightness-110 transition-all shadow-sm"
            >
              <ApperIcon name="Plus" size={16} />
              <span className="hidden sm:inline">Quick Add</span>
            </motion.button>
            
            {/* Logout button */}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-200 transition-all shadow-sm"
              >
                <ApperIcon name="LogOut" size={16} />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Quick Add Modal */}
      <QuickAddModal 
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
      />
    </>
  );
};

export default Header;