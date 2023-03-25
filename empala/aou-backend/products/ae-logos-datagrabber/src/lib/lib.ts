export const sleep = (timeOut: number) => new Promise((resolve) => {
  setTimeout(resolve, timeOut);
});
