export function getAllUrlParams(url = null) {
  // get query string from url (optional) or window
  let queryString = url ? url.split("?")[1] : window.location.search.slice(1);

  // we add slash to the end of url by route
  // so in some cases we need to delete it for get query params correctly
  queryString = queryString.endsWith("/")
    ? queryString.slice(0, -1)
    : queryString;

  queryString = decodeURIComponent(queryString);

  // we'll store the parameters here
  const obj = {};

  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split("#")[0];

    // split our query string into its component parts
    const arr = queryString.split("&");

    for (let i = 0; i < arr.length; i++) {
      // separate the keys and the values
      const a = arr[i].split("=");

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var isArray = false;
      let paramName = a[0].replace(/\[\d*\]/, (v) => {
        paramNum = v.slice(1, -1);
        isArray = true;
        return "";
      });

      // set parameter value (use 'true' if empty)
      let paramValue = typeof a[1] === "undefined" ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toString().toLowerCase();
      paramValue = paramValue.toString().toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // if no array index number specified...
        if (isArray && paramNum) {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
        // if array index number specified...
        else {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
      }
      // if param name doesn't exist yet, set it
      else if (isArray) obj[paramName] = [paramValue];
      else obj[paramName] = paramValue;
    }
  }
  return obj;
}
