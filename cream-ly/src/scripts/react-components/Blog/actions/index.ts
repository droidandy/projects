export const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};

export const updateFilterParams = (params: any) => {
  Object.keys(params).forEach((key: string) => {
    sessionStorage.setItem(key, JSON.stringify(params[key]));
  });
};

export const getFilterParam = (key, defaultValue) => {
  try {
    const value = sessionStorage.getItem(key);
    if (value) return JSON.parse(value);
    sessionStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch {
    sessionStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
};
