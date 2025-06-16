import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CreateListModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#5B47E0');
  const [selectedIcon, setSelectedIcon] = useState('List');
  const [loading, setLoading] = useState(false);

  const colors = [
    { name: 'Purple', value: '#5B47E0' },
    { name: 'Coral', value: '#FF6B6B' },
    { name: 'Green', value: '#4ADE80' },
    { name: 'Yellow', value: '#FBBF24' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Teal', value: '#14B8A6' }
  ];

  const icons = [
    'List', 'Briefcase', 'User', 'Home', 'ShoppingCart', 
    'Heart', 'Star', 'Target', 'BookOpen', 'Coffee'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        color: selectedColor,
        icon: selectedIcon
      });
      
      // Reset form
      setName('');
      setSelectedColor('#5B47E0');
      setSelectedIcon('List');
    } catch (err) {
      // Error handled by parent
    } finally {
      setLoading(false);
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
          >
            <div className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-xl text-gray-900">
                  Create New List
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* List Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    List Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter list name"
                    className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    autoFocus
                  />
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Color
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {colors.map((color) => (
                      <motion.button
                        key={color.value}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-12 h-12 rounded-lg transition-all ${
                          selectedColor === color.value
                            ? 'ring-2 ring-offset-2 ring-gray-400'
                            : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {icons.map((icon) => (
                      <motion.button
                        key={icon}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedIcon(icon)}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedIcon === icon
                            ? 'border-primary bg-primary/10'
                            : 'border-surface-300 hover:border-surface-400'
                        }`}
                      >
                        <ApperIcon 
                          name={icon} 
                          size={20} 
                          className={selectedIcon === icon ? 'text-primary' : 'text-gray-600'} 
                        />
                      </motion.button>
                    ))}
                  </div>
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
                    disabled={!name.trim() || loading}
                    loading={loading}
                    className="flex-1"
                  >
                    Create List
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

export default CreateListModal;