export const formatHours = (minutes) => {
  if (!minutes) {
    return '0 min';
  }

  const hours = minutes / 60;

  if (hours < 1) {
    return `${minutes} min`;
  }

  return `${hours.toLocaleString(undefined, { maximumFractionDigits: 1 })} hrs`;
};

export const timeAgo = (date) => {
  if (!date) {
    return '';
  }

  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);

  if (minutes < 60) {
    return 'Just now';
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}d ago`;
  }

  const months = Math.floor(days / 30);
  return months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`;
};

export const headerImageUrl = (appId) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
