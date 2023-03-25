// @flow
const sampleProps = {
  categories: [
    {
      name: 'Category',
      subcategories: [
        { id: '1', name: 'Subcategory1' },
        { id: '2', name: 'Subcategory2' },
        { id: '3', name: 'Subcategory3' },
        { id: '4', name: 'Subcategory4' },
      ],
    },
    {
      name: 'Another Category',
      subcategories: [
        { id: '5', name: 'Subcategory5' },
        { id: '6', name: 'Subcategory6' },
        { id: '7', name: 'Subcategory7' },
        { id: '8', name: 'Subcategory8' },
        { id: '9', name: 'Subcategory9' },
      ],
    },
  ],
  manufacturers: [
    { id: '1', name: 'Manufacturer' },
    { id: '2', name: 'Another Manufacturer' },
    { id: '3', name: 'Super Manufacturer' },
    { id: '4', name: 'Manu' },
  ],
  recommendedRFQs: [
    {
      id: '1',
      title: 'Steel Pipes API 5 Seamless',
      user: {
        name: 'Marc Foster',
      },
    },
    {
      id: '2',
      title: 'Steel Pipes API 5 Seamless',
      user: {
        name: 'John Blinnings',
      },
    },
    {
      id: '3',
      title: 'Steel Pipes Seamless RG M71',
      user: {
        name: 'Rob Queilan',
      },
    },
  ],
};

export default sampleProps;
