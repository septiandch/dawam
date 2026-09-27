export function dailyIndex(date = new Date(), count = 2) {
  return (
    Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000) % count
  );
}

/** Local calendar date as `YYYY-MM-DD`; stable all day, changes at local midnight. */
export function dailyKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
}
