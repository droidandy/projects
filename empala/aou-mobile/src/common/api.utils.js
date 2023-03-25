export const unwrapError = (error) => {
  let data;
  if (error) {
    if (error.response && error.response.data) {
      data = error.response.data;
    } else if (error.message) {
      data = error.message;
    }
  }
  throw data;
};
