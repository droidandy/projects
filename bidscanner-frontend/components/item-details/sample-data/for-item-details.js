// @flow
const comments = [
  {
    username: 'Carter Sanders',
    message: 'Irure quis eu excepteur cupidatat ullamco id nostrud anim velit minim consequat proident dolore. Eiusmod nisi nisi incididunt ipsum in id officia irure irure excepteur ut ullamco. Aute incididunt voluptate aliqua eiusmod ex aliquip irure aliquip et ex eiusmod nulla laboris.\r\n',
  },
  {
    username: 'Mercado Oliver',
    message: 'Duis tempor et proident sint aliquip amet pariatur magna consequat laboris excepteur consectetur. Nostrud occaecat occaecat cupidatat ipsum Lorem ad aliqua ullamco veniam amet veniam.\r\n',
  },
  {
    username: 'Vega Williamson',
    message: 'Consequat sint cillum non incididunt officia consequat consectetur labore mollit commodo veniam. Cillum irure occaecat cupidatat magna sit nisi.\r\n',
  },
  {
    username: 'Matilda Pennington',
    message: 'Labore quis tempor dolor incididunt officia do amet quis ullamco aliqua aute officia labore. Consequat ipsum et in veniam aliquip dolor sint do anim. Id in magna aute exercitation enim ex dolor velit nostrud commodo enim nulla velit.\r\n',
  },
];

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

  description: 'Aliquam sit amet malesuada purus. Praesent condimentum velit id lectus fringilla fringilla. Maecenas at cursus urna, non suscipit metus. Mauris interdum ipsum a lacus placerat, eget interdum mi blandit. Praesent non sem dictum nisi vulputate vehicula. Nunc vitae ipsum at erat condimentum aliquam. Maecenas aliquet ullamcorper leo, et efficitur nisl fermentum ac. Cras ultricies ultricies malesuada. Donec dignissim quam quis commodo congue. Fusce dapibus, nibh nec viverra hendrerit, felis neque tincidunt lorem, molestie volutpat sapien dolor ut tortor.',
  address: 'Ap #651-8679 Sodales Av. Tamuning PA 10855',
  manufacturer: 'SomeAmazingCompany',

  username: 'Jack Sparrow',
  rating: 90,
  company: 'Bidscanner',
  country: 'USA',
  loggedIn: true,

  pictures,
  comments,
  keywords,
};
