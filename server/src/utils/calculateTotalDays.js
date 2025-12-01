const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const calculateTotalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end) || end < start) {
    throw new Error('Invalid dates supplied');
  }

  const diff = Math.round((end - start) / MILLISECONDS_PER_DAY) + 1;
  return diff;
};

module.exports = calculateTotalDays;


