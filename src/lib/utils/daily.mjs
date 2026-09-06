export function dailyIndex(date = new Date(), count = 2) {
  return (
    Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000) % count
  );
}
