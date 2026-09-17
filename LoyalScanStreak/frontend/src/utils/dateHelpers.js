// Frontend-side helpers - purely for UI hints (badges, banners, popups).
// The BACKEND is always the real authority on the "1 point per day" rule;
// these are just used to decide what to show on screen.

export const isWithinHours = (dateString, hours) => {
  if (!dateString) return false;
  const diffMs = Date.now() - new Date(dateString).getTime();
  return diffMs >= 0 && diffMs <= hours * 60 * 60 * 1000;
};

// Approximate "is this today" check using the browser's local time - fine
// for a cosmetic badge, not used to block/allow anything.
export const isToday = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString).toDateString() === new Date().toDateString();
};
