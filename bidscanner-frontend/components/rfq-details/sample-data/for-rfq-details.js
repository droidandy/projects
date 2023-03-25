const comments = [
  {
    username: 'Carter Sanders',
    message:
      'Irure quis eu excepteur cupidatat ullamco id nostrud anim velit minim consequat proident dolore. Eiusmod nisi nisi incididunt ipsum in id officia irure irure excepteur ut ullamco. Aute incididunt voluptate aliqua eiusmod ex aliquip irure aliquip et ex eiusmod nulla laboris.\r\n',
  },
  {
    username: 'Mercado Oliver',
    message:
      'Duis tempor et proident sint aliquip amet pariatur magna consequat laboris excepteur consectetur. Nostrud occaecat occaecat cupidatat ipsum Lorem ad aliqua ullamco veniam amet veniam.\r\n',
  },
  {
    username: 'Vega Williamson',
    message:
      'Consequat sint cillum non incididunt officia consequat consectetur labore mollit commodo veniam. Cillum irure occaecat cupidatat magna sit nisi.\r\n',
  },
  {
    username: 'Matilda Pennington',
    message:
      'Labore quis tempor dolor incididunt officia do amet quis ullamco aliqua aute officia labore. Consequat ipsum et in veniam aliquip dolor sint do anim. Id in magna aute exercitation enim ex dolor velit nostrud commodo enim nulla velit.\r\n',
  },
];

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
  seenTimes: 12,
  likedTimes: 3,

  description:
    'Aliquam sit amet malesuada purus. Praesent condimentum velit id lectus fringilla fringilla. Maecenas at cursus urna, non suscipit metus. Mauris interdum ipsum a lacus placerat, eget interdum mi blandit. Praesent non sem dictum nisi vulputate vehicula. Nunc vitae ipsum at erat condimentum aliquam.',
  pictures: 'http://via.placeholder.com/400x400',
  shippingAddress: '112645 Osaksa Tokio Japan',
  manufacturer: 'SomeAmazingCompany',

  username: 'Jack Sparrow',
  rating: 42,
  company: 'Bidscanner',
  country: 'USA',
  comments,
  files,
  keywords,
};

export default sampleData;
