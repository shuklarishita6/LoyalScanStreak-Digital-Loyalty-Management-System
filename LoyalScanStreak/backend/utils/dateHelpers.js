// All "calendar day" logic goes through this one file, so the day-boundary
// rule is defined in exactly one place instead of being copy-pasted around.

// Business timezone - change this if the restaurant is elsewhere.
const TIMEZONE = 'Asia/Kolkata';

// Returns a date as "YYYY-MM-DD" in the given timezone. We compare THIS,
// not raw timestamps - so 11:50 PM and 12:05 AM the next day are correctly
// treated as two different calendar days, not "within 24 hours."
const toDateKey = (date, timeZone = TIMEZONE) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date); // en-CA locale happens to format as YYYY-MM-DD
};

const isSameCalendarDay = (dateA, dateB) => {
  if (!dateA || !dateB) return false;
  return toDateKey(new Date(dateA)) === toDateKey(new Date(dateB));
};

module.exports = { toDateKey, isSameCalendarDay, TIMEZONE };
