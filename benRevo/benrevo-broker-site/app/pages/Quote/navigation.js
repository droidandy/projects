import {
  LIFE_SECTION,
  VOL_LIFE_SECTION,
  STD_SECTION,
  VOL_STD_SECTION,
  LTD_SECTION,
  VOL_LTD_SECTION,
} from './constants';

const navigation = {
  major: [
    {
      id: 0, title: 'Medical', link: 'medical', class: 'nav-medical',
    },
    {
      id: 1, title: 'Dental', link: 'dental', class: 'nav-dental',
    },
    {
      id: 2, title: 'Vision', link: 'vision', class: 'nav-vision',
    },
    {
      id: 3, title: 'Life/AD&D', link: 'life', class: 'nav-life',
    },
    /* {
      id: 4, title: 'Vol Life/AD&D', link: 'vol_life', class: 'nav-life',
    }, */
    {
      id: 5, title: 'STD', link: 'std', class: 'nav-ltd',
    },
    /* {
      id: 6, title: 'Vol STD', link: 'vol_std', class: 'nav-ltd',
    }, */
    {
      id: 7, title: 'LTD', link: 'ltd', class: 'nav-ltd',
    },
    /* {
      id: 8, title: 'Vol LTD', link: 'vol_ltd', class: 'nav-ltd',
    }, */
  ],
  minor: [
    {
      id: 0, title: 'Compare Plans', link: 'compare', class: 'nav-plans',
    },
    {
      id: 1, title: 'Enrollment', link: 'enrollment', class: 'nav-enrollment', modal: true,
    },
    {
      id: 2, title: 'Network Tools', link: 'tools', class: 'nav-tools', modal: true,
    },
    {
      id: 3, title: 'Disclosures', link: 'disclosure', class: 'nav-disclosure', modal: true,
    },
  ],
};

export default function getNavigation(products = {}) {
  const finalNav = navigation;

  for (let i = 0; i < finalNav.major.length; i += 1) {
    const item = finalNav.major[i];
    for (let j = 0; j < Object.keys(products).length; j += 1) {
      const key = Object.keys(products)[j];
      const product = products[key];
      if (item.link === key && product === false) {
        item.hidden = true;
      } else if (item.link === VOL_LIFE_SECTION && products[LIFE_SECTION] === false) item.hidden = true;
      else if (item.link === VOL_STD_SECTION && products[STD_SECTION] === false) item.hidden = true;
      else if (item.link === VOL_LTD_SECTION && products[LTD_SECTION] === false) item.hidden = true;
      else if (item.link === VOL_LIFE_SECTION && products[LIFE_SECTION]) item.hidden = false;
      else if (item.link === VOL_STD_SECTION && products[STD_SECTION]) item.hidden = false;
      else if (item.link === VOL_LTD_SECTION && products[LTD_SECTION]) item.hidden = false;
      else if (item.link === key && product) {
        item.hidden = false;
      }
    }
  }

  return finalNav;
}
