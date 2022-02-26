export const validateHour = (value: string): boolean => {
  return Number(value) >= 0 && Number(value) <= 23;
};

export const validateMinute = (value: string): boolean => {
  return Number(value) >= 0 && Number(value) <= 60;
};
