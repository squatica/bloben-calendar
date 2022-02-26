export const validateDay = (value: string): boolean => {
  return Number(value) > 0 && Number(value) <= 24;
};

export const validateMonth = (value: string): boolean => {
  return Number(value) > 0 && Number(value) <= 12;
};

export const validateYear = (value: string): boolean => {
  return Number(value) > 0 && Number(value) <= 2100;
};

export const validateDate = (
  day: string,
  month: string,
  year: string
): boolean =>
  validateDay(day) &&
  validateMonth(month) &&
  Number(year) > 1990 &&
  Number(year) < 2100;
