// src/components/ui/Spinner.jsx
const Spinner = ({ size = 'md' }) => {
  const sizeMap = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={`animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 ${sizeMap[size]}`} />
  );
};

export default Spinner;
