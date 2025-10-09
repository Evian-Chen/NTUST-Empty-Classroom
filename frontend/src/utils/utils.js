export const getLastSat = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysUntilLastSaturday = dayOfWeek === 0 ? 1 : dayOfWeek + 1; // Days to go back to last Saturday

  const lastSaturday = new Date(today);
  lastSaturday.setDate(today.getDate() - daysUntilLastSaturday);
  return lastSaturday;
};
