export const getCurrentDateForSQL = (): string => {
  const now = new Date();
  return now.toISOString(); // Converts the date to ISO string format
};
