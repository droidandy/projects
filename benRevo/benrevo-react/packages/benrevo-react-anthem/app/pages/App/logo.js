const logo = { link: null };
const list = [
  import('./../../assets/img/anthem_logo.png'),
];

export const importLogo = Promise.all(list);

importLogo.then((data) => {
  logo.link = data[0];
});

export default logo;
