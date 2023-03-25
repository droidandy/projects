import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';

import SearchTextField from 'components/forms-components/SearchTextField';
import Filter from 'components/forms-components/dropdowns/Filter';
import NestedFilter from 'components/forms-components/dropdowns/NestedFilter';

import SearchIcon from '../../svg/search.svg';

const Icon = styled.div`margin-bottom: 5px;`;

const values = ['Relevance', 'Posting Date', 'Price', 'Alphabetical', 'Company'];

const categories = [
  {
    name: 'Stud Bolts',
    subcategories: [
      {
        id: 0,
        name: 'Stud Bolts M55',
      },
      {
        id: 1,
        name: 'Stud Bolts M7',
      },
      {
        id: 2,
        name: 'Stud Bolts Extra Long',
      },
      {
        id: 2,
        name: 'Stud Bolts Hardened',
      },
      {
        id: 2,
        name: 'Stud Bolts Extra Short',
      },
    ],
  },
  {
    name: 'Jeri Herring',
    subcategories: [
      {
        id: 0,
        name: 'Hammond Russo',
      },
      {
        id: 1,
        name: 'Brianna Griffin',
      },
      {
        id: 2,
        name: 'Riley Glenn',
      },
    ],
  },
  {
    name: 'Penny Grant',
    subcategories: [
      {
        id: 0,
        name: 'Ramos Ware',
      },
      {
        id: 1,
        name: 'Alisha Munoz',
      },
      {
        id: 2,
        name: 'Frederick Stuart',
      },
    ],
  },
  {
    name: 'Vargas Lynch',
    subcategories: [
      {
        id: 0,
        name: 'Robert Fox',
      },
      {
        id: 1,
        name: 'Ferrell Ray',
      },
      {
        id: 2,
        name: 'Gwen Joseph',
      },
    ],
  },
  {
    name: 'Odessa Ortega',
    subcategories: [
      {
        id: 0,
        name: 'Delia Delacruz',
      },
      {
        id: 1,
        name: 'Benita Steele',
      },
      {
        id: 2,
        name: 'Loraine Valentine',
      },
    ],
  },
  {
    name: 'Burton Browning',
    subcategories: [
      {
        id: 0,
        name: 'Kellie Ferguson',
      },
      {
        id: 1,
        name: 'Perkins Stein',
      },
      {
        id: 2,
        name: 'Meyer Chan',
      },
    ],
  },
  {
    name: 'Deanna Bond',
    subcategories: [
      {
        id: 0,
        name: 'Winnie Witt',
      },
      {
        id: 1,
        name: 'Dianne Wolfe',
      },
      {
        id: 2,
        name: 'Courtney May',
      },
    ],
  },
  {
    name: 'Armstrong Fuller',
    subcategories: [
      {
        id: 0,
        name: 'Lidia Nash',
      },
      {
        id: 1,
        name: 'Robyn Mooney',
      },
      {
        id: 2,
        name: 'Amanda Henry',
      },
    ],
  },
  {
    name: 'Petra Horton',
    subcategories: [
      {
        id: 0,
        name: 'Shanna Adams',
      },
      {
        id: 1,
        name: 'Green Robbins',
      },
      {
        id: 2,
        name: 'Hannah Jefferson',
      },
    ],
  },
  {
    name: 'Chang Potts',
    subcategories: [
      {
        id: 0,
        name: 'Selena Moore',
      },
      {
        id: 1,
        name: 'Tanner Gibbs',
      },
      {
        id: 2,
        name: 'Gill Robinson',
      },
    ],
  },
];

export default () =>
  <div>
    <Flex w={[1, 1 / 2]} align="flex-end" mt={2}>
      <Field name="string" component={SearchTextField} placeholder="Search RFQs" />
      <Icon>
        <SearchIcon />
      </Icon>
    </Flex>
    <Flex mt={2} wrap>
      <Box mr={1}>
        <Field name="subcategory" component={NestedFilter} title="Category" categories={categories} />
      </Box>
      <Box mr={1}>
        <Field name="company" component={Filter} title="Company" options={values} />
      </Box>
      <Box mr={1}>
        <Field name="country" component={Filter} title="Country" options={values} />
      </Box>
      <Box mr={1}>
        <Field name="company-type" component={Filter} title="Company Type" options={values} />
      </Box>
      <Box mr={1}>
        <Field name="certification" component={Filter} title="Certification" options={values} />
      </Box>
      <Box mr={1}>
        <Field name="distance" component={Filter} title="Distance" options={values} />
      </Box>
    </Flex>
  </div>;
