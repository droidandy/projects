import {
  RFP_MEDICAL_SECTION,
  RFP_DENTAL_SECTION,
  RFP_VISION_SECTION,
} from './constants';

const navigation = {
  major: [
    {
      id: 11, title: 'Client Info', link: 'client', class: 'nav-rfp-client',
    },
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
    {
      id: 5, title: 'STD', link: 'std', class: 'nav-ltd',
    },
    {
      id: 7, title: 'LTD', link: 'ltd', class: 'nav-ltd',
    },
    {
      id: 8, title: 'Rates', link: 'rates', class: 'nav-rfp-rates',
    },
    {
      id: 9, title: 'Enrollment', link: 'enrollment', class: 'nav-rfp-enrollment',
    },
    {
      id: 10, title: 'Add Team', link: 'team', class: 'nav-rfp-addteam',
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
      } else if (item.link === key && product) {
        item.hidden = false;
      }
    }
  }

  finalNav.major[8].hidden = !products[RFP_MEDICAL_SECTION] && !products[RFP_DENTAL_SECTION] && !products[RFP_VISION_SECTION];

  return finalNav;
}
