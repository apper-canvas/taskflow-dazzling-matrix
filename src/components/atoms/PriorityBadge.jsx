const PriorityBadge = ({ priority }) => {
  const configs = {
    high: {
      label: 'High',
      classes: 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
    },
    medium: {
      label: 'Medium', 
      classes: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
    },
    low: {
      label: 'Low',
      classes: 'bg-surface-200 text-gray-700'
    }
  };

  const config = configs[priority] || configs.medium;

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
};

export default PriorityBadge;