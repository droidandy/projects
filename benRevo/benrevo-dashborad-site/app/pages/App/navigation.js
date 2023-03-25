const navigation = {
  major: [
    {
      title: 'Client Info',
      accordion: true,
      link: 'client',
      class: 'nav-client',
      id: Math.random().toString(36).substr(2, 16),
      content: [{
        title: 'Information',
        id: Math.random().toString(36).substr(2, 16),
        link: 'client/info',
      }, {
        title: 'Products',
        id: Math.random().toString(36).substr(2, 16),
        link: 'client/products',
      }],
    },
    {
      title: 'Medical Info',
      accordion: true,
      link: 'medical',
      class: 'nav-medical',
      id: Math.random().toString(36).substr(2, 16),
      content: [{
        title: 'Information',
        id: Math.random().toString(36).substr(2, 16),
        link: 'medical/info',
      }, {
        title: 'Contribution',
        id: Math.random().toString(36).substr(2, 16),
        link: 'medical/contribution',
      }, {
        title: 'Rates',
        id: Math.random().toString(36).substr(2, 16),
        link: 'medical/rates',
      }, {
        title: 'Enrollment',
        id: Math.random().toString(36).substr(2, 16),
        link: 'medical/enrollment',
      }, {
        title: 'UW Adjustment',
        id: Math.random().toString(36).substr(2, 16),
        link: 'medical/uw',
      }, {
        title: 'Benefits',
        id: Math.random().toString(36).substr(2, 16),
        link: 'medical/benefits',
      }],
    },
    {
      title: 'Dental Info',
      link: 'dental',
      class: 'nav-dental',
      id: Math.random().toString(36).substr(2, 16),
      content: [{
        title: 'Information',
        id: Math.random().toString(36).substr(2, 16),
        link: 'dental/info',
      }, {
        title: 'Contribution',
        id: Math.random().toString(36).substr(2, 16),
        link: 'dental/contribution',
      }, {
        title: 'Rates',
        id: Math.random().toString(36).substr(2, 16),
        link: 'dental/rates',
      }, {
        title: 'Enrollment',
        id: Math.random().toString(36).substr(2, 16),
        link: 'dental/enrollment',
      }, {
        title: 'Benefits',
        id: Math.random().toString(36).substr(2, 16),
        link: 'dental/benefits',
      }],
    },
    {
      title: 'Vision Info',
      link: 'vision',
      class: 'nav-vision',
      id: Math.random().toString(36).substr(2, 16),
      content: [{
        title: 'Information',
        id: Math.random().toString(36).substr(2, 16),
        link: 'vision/info',
      }, {
        title: 'Contribution',
        id: Math.random().toString(36).substr(2, 16),
        link: 'vision/contribution',
      }, {
        title: 'Rates',
        id: Math.random().toString(36).substr(2, 16),
        link: 'vision/rates',
      }, {
        title: 'Enrollment',
        id: Math.random().toString(36).substr(2, 16),
        link: 'vision/enrollment',
      }],
    },
    {
      title: 'Info Summary',
      link: 'summary',
      class: 'nav-summary',
      id: Math.random().toString(36).substr(2, 16),
    },
    {
      title: 'Send Rater',
      link: 'rater',
      class: 'nav-rater',
      id: Math.random().toString(36).substr(2, 16),
    },
    {
      title: 'Upload Quote',
      link: 'quote',
      class: 'nav-quote',
      id: Math.random().toString(36).substr(2, 16),
    },
    {
      title: 'Match Plans',
      accordion: true,
      link: 'match',
      class: 'nav-plans',
      id: Math.random().toString(36).substr(2, 16),
      content: [{
        title: 'Medical',
        id: Math.random().toString(36).substr(2, 16),
        link: 'match/medical',
      }, {
        title: 'Medical w/Kaiser',
        id: Math.random().toString(36).substr(2, 16),
        link: 'match/kaiser',
      }, {
        title: 'Dental',
        id: Math.random().toString(36).substr(2, 16),
        link: 'match/dental',
      }, {
        title: 'Vision',
        id: Math.random().toString(36).substr(2, 16),
        link: 'match/vision',
      }],
    },
    {
      title: 'Rate Bank',
      link: 'rate',
      class: 'nav-bank',
      id: Math.random().toString(36).substr(2, 16),
      content: [{
        title: 'Medical',
        id: Math.random().toString(36).substr(2, 16),
        link: 'rate/medical',
      }, {
        title: 'Medical w/Kaiser',
        id: Math.random().toString(36).substr(2, 16),
        link: 'rate/kaiser',
      }],
    },
    {
      title: 'Send to Broker',
      link: 'send',
      class: 'nav-broker',
      id: Math.random().toString(36).substr(2, 16),
    },
  ],
};

export default function getNavigation(products) {
  const finalNav = navigation;

  for (let i = 0; i < finalNav.major.length; i += 1) {
    const item = finalNav.major[i];
    for (let j = 0; j < Object.keys(products).length; j += 1) {
      const key = Object.keys(products)[j];
      const product = products[key];
      if (item.link === key && !product) item.hidden = true;
      else if (item.link !== key && item.content) {
        for (let o = 0; o < item.content.length; o += 1) {
          const item2 = item.content[o];
          if (item2.link.indexOf(key) >= 0 && !product) {
            item2.hidden = true;
            if (key === 'medical') item.content[o + 1].hidden = true;
          } else if (item2.link.indexOf(key) >= 0 && product) {
            item2.hidden = false;

            if (key === 'medical') item.content[o + 1].hidden = false;
          }
        }
      } else if (item.link === key && product) {
        item.hidden = false;
      }

      if (key === 'medical' && item.link === 'rate' && !product) item.hidden = true;
      else if (key === 'medical' && item.link === 'rate' && product) item.hidden = false;
    }
  }

  return finalNav;
}
