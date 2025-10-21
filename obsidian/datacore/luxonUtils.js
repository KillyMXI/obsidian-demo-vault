
/**
 * Returns a DateTime at the start of the week,
 * using a custom first weekday (1 = Monday).
 */
function startOfWeek(dt, firstDay = 1) {
  const normalizedFirstDay = ((firstDay + 6) % 7) + 1; // maps 0→7, 1→1, 7→7
  const diff = (dt.weekday - normalizedFirstDay + 7) % 7;
  return dt.minus({ days: diff }).startOf("day");
}

/**
 * Returns a DateTime at the end of the week,
 * using a custom first weekday (1 = Monday).
 */
function endOfWeek(dt, firstDay = 1) {
  const normalizedFirstDay = ((firstDay + 6) % 7) + 1; // maps 0→7, 1→1, 7→7
  const diff = (normalizedFirstDay - dt.weekday + 6) % 7;
  return dt.plus({ days: diff }).endOf("day");
}

/**
 * Returns true if two DateTimes fall in the same custom-defined week.
 */
function hasSameWeek(dt1, dt2, firstDay = 1) {
  const s1 = startOfWeek(dt1, firstDay);
  const s2 = startOfWeek(dt2, firstDay);
  return s1.hasSame(s2, "day");
}

return {
  startOfWeek,
  endOfWeek,
  hasSameWeek,
};
