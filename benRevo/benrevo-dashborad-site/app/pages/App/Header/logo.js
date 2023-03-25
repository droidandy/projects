import { CARRIER, carriers } from '../../../config';

const logo = { link: null };
const currentCarrier = carriers[CARRIER];
const list = [
  import(`../../../assets/img/svg/${currentCarrier}_logo.svg`),
];

export const importLogo = Promise.all(list);

importLogo.then((data) => {
  logo.link = data[0];
});

export default logo;
