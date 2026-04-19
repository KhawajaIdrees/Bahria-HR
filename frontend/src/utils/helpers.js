export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getStatusColor = (status) => {
  const colors = {
    Draft: 'bg-gray-100 text-gray-800',
    Active: 'bg-green-100 text-green-800',
    Completed: 'bg-blue-100 text-blue-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    InProgress: 'bg-blue-100 text-blue-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};