export const paramsToString = (params: object): string => {
  const stringParams = Object.entries(params).reduce<Record<string, string>>((acc, item) => {
    acc[item[0]] = `${item[1]}`;
    return acc;
  }, {});
  const searchParams = new URLSearchParams(stringParams);
  return searchParams.toString();
};
