// @flow
const pictures = [
  {
    url: 'https://placeimg.com/400/300/tech',
  },
  {
    url: 'https://placeimg.com/400/300/tech',
  },
  {
    url: 'https://placeimg.com/400/300/tech',
  },
];

const keywords = ['default', 'primary', 'sucess', 'info', 'warning', 'danger', 'hello'];

export default {
  price: 7000,
  currency: 'USD',

  name: 'Brand new soldering machine',
  created: new Date(2014, 6, 2),
  seenTimes: 12,
  likedTimes: 3,

  description:
    'Aliquam sit amet malesuada purus. Praesent condimentum velit id lectus fringilla fringilla. Maecenas at cursus urna, non suscipit metus. Mauris interdum ipsum a lacus placerat, eget interdum mi blandit. Praesent non sem dictum nisi vulputate vehicula. Nunc vitae ipsum at erat condimentum aliquam. Maecenas aliquet ullamcorper leo, et efficitur nisl fermentum ac. Cras ultricies ultricies malesuada. Donec dignissim quam quis commodo congue. Fusce dapibus, nibh nec viverra hendrerit, felis neque tincidunt lorem, molestie volutpat sapien dolor ut tortor.',
  address: 'Ap #651-8679 Sodales Av. Tamuning PA 10855',
  manufacturer: 'SomeAmazingCompany',

  username: 'Jack Sparrow',
  rating: 90,
  company: 'Bidscanner',
  country: 'USA',
  loggedIn: true,

  pictures,
  keywords,
};
