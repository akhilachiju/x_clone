const colors = [
  'bg-red-500',
  'bg-blue-500', 
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-cyan-500'
];

export const getColorFromId = (id: string) => {
  if (!id) return 'bg-gray-600';
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const getUserAvatarId = (session: any, user?: any) => {
  return session?.user?.email?.split('@')[0] || user?.username || user?.id || "default";
};
