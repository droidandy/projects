//@ts-nocheck
export const getURL = () => {
  const url = new URL("https://pro.ip-api.com/json/");

  const API_KEY = "yJ0lvDquk2LMB9q";
  url.searchParams.append("key", API_KEY);

  url.searchParams.append(
    "fields",
    [
      "status",
      "countryCode",
      "currency",
      "country",
      "zip",
      "city",
      "region",
    ].join(",")
  );

  return url.href;
};

export default (): Promise<ipAPI.ILocationData | null> => {
  return fetch(getURL())
    .then((res) => (res ? res.json() : null))
    .then(checkResultStatus);
};

export const checkResultStatus = (result: ipAPI.ILocationData) => {
  if (!result || result.status != "success" || !result.countryCode) return;
  return result;
};
