export const getFromLocalStorage = <T = any>(key: string): T | null => {
  const value = localStorage.getItem(key);
  if (value !== null) return JSON.parse(value);
  return value;
};

export const setInLocalStorage = (key: string, value: any) => {
  if (typeof value === 'string') {
    localStorage.setItem(key, value);
  } else {
    const stringified = JSON.stringify(value);
    localStorage.setItem(key, stringified);
  }
};
