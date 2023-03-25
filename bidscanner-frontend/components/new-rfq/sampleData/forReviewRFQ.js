// @flow

const files = [
  {
    name: 'Specifications.xls',
    path: './sample.txt',
  },
  {
    name: 'requirements#2.xls',
    path: './sample.txt',
  },
];

const keywords = ['steel pipe', 'discount', 'seampless', 'API 5l', 'test'];

const sampleData = {
  price: 7000,
  currency: 'USD',
  purchase: 'Firm Purchase',
  name: 'RFQ name example',
  created: new Date(2017, 6, 15),
  expireTime: new Date(2017, 7, 20),
  deliveryDate: new Date(2017, 12, 20),

  description:
    'Aliquam sit amet malesuada purus. Praesent condimentum velit id lectus fringilla fringilla. Maecenas at cursus urna, non suscipit metus. Mauris interdum ipsum a lacus placerat, eget interdum mi blandit. Praesent non sem dictum nisi vulputate vehicula. Nunc vitae ipsum at erat condimentum aliquam.',
  shippingAddress: '112645 Osaksa Tokio Japan',

  username: 'Jack Sparrow',
  rating: 42,
  company: 'Bidscanner',
  country: 'USA',
  files,
  keywords,
};

export default sampleData;
