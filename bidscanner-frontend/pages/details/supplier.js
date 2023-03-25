// @flow
import React from 'react';
import withData from 'lib/withData';
import SupplierDetails from 'components/supplier-details/SupplierDetails';

const comments = [
  {
    username: 'Carter Sanders',
    message:
      'Laboris exercitation nulla anim Lorem magna nostrud elit sit duis commodo cillum non ullamco cillum.,',
  },
  {
    username: 'Mercado Oliver',
    message:
      'Commodo ut anim ut Lorem esse ullamco in ex ea dolor aliquip. Duis tempor et proident sint aliquip',
  },
  {
    username: 'Vega Williamson',
    message:
      'Dolore laboris incididunt consequat occaecat irure sit adipisicing deserunt consequat voluptate. Consequat sint cillum non incididunt',
  },
  {
    username: 'Matilda Pennington',
    message: 'Sint sit adipisicing ea velit. Reprehenderit aute sunt cupidatat',
  },
];

const products = [
  {
    image: '/static/100.png',
    title: 'Steel pipes',
    subtitle: '700$',
  },
  {
    image: '/static/100.png',
    title: 'API 5L steel',
    subtitle: '650$',
  },
  {
    image: '/static/100.png',
    title: 'Large gauge',
    subtitle: '400$',
  },
  {
    image: '/static/100.png',
    title: 'Steel pipes',
    subtitle: '300$',
  },
  {
    image: '/static/100.png',
    title: 'Hats',
    subtitle: '250$',
  },
  {
    image: '/static/400.png',
    title: 'Product',
    subtitle: '350$',
  },
  {
    image: '/static/100.png',
    title: 'Product2',
    subtitle: '278$',
  },
  {
    image: '/static/100.png',
    title: 'Water plant',
    subtitle: '500$',
  },
];

const sampleProps = {
  name: 'Marc Foster',
  image: '/static/400.png',
  follows: 32,
  followers: 192,
  rating: 85, // number [0-100]
  sells: ['pipes', 'steel', 'api', 'seamles', 'pipes'],
  buys: ['steel', 'pipe', '5l'],
  company: 'General electric',
  country: 'USA',
  loggedIn: false,
  products,
  comments,
};

const Supplier = () => (
  <div>
    <SupplierDetails {...sampleProps} />
  </div>
);

export default withData(Supplier);
