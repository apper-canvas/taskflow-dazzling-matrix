import { format } from 'date-fns';

const DatePicker = ({ value, onChange }) => {
  const formatValue = () => {
    if (!value) return '';
    return format(new Date(value), 'yyyy-MM-dd');
  };

  const handleChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const isoString = new Date(dateValue + 'T12:00:00.000Z').toISOString();
      onChange(isoString);
    } else {
      onChange('');
    }
  };

  return (
    <input
      type="date"
      value={formatValue()}
      onChange={handleChange}
      className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
    />
  );
};

export default DatePicker;