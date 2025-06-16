import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar';
import ApperIcon from '@/components/ApperIcon';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <Header onToggleMobileMenu={toggleMobileMenu} />
      
      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-surface border-r border-surface-200">
          <Sidebar />
        </aside>
        
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={toggleMobileMenu}
              />
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed left-0 top-16 bottom-0 w-80 bg-surface border-r border-surface-200 z-50 lg:hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-surface-200">
                  <h2 className="font-display font-semibold text-gray-900">Menu</h2>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                <Sidebar onItemClick={toggleMobileMenu} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;