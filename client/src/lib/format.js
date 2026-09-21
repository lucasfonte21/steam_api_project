export const formatHours = (minutes) => {
  if (!minutes) {
    return 'Never played';
  }

  const hours = minutes / 60;

  if (hours < 1) {
    return `${minutes} min`;
  }

  return `${hours.toLocaleString(undefined, { maximumFractionDigits: 1 })} hrs`;
};

export const headerImageUrl = (appId) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
