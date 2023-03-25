/* eslint-disable */

export default function generateUUID () {
  let d = new Date().getTime();
  const mask = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return mask.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
}
