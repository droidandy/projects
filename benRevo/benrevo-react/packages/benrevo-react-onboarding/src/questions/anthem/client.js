import * as types from '../../types';
import Section1Description from './client/Section1Description';
import states from '../../states';

const administrative = {
  section1: {
    title: 'Your client contact information',
    description: Section1Description,
    blocks: [
      {
        title: 'Add contacts',
        data: [
          {
            key: 'contact_counter',
            title: 'Number of contacts',
            type: types.COUNT,
            defaultItem: 1,
            max: 4,
            min: 1,
          },
        ],
      },
      {
        title: 'Contact',
        dependency: 'contact_counter',
        data: [
          {
            key: 'contact_role_',
            title: 'Roles covered:',
            type: types.CHECKBOX,
            parent: 'contact_counter',
            unique: true,
            list: [
              'Group Administrator',
              'Billing Contact',
              'Decision Maker',
              'Designated HIPAA Representative',
            ],
          },
          {
            key: 'contact_name_',
            title: 'Name',
            type: types.STRING,
          },
          {
            key: 'contact_title_',
            title: 'Title',
            type: types.STRING,
          },
          {
            key: 'contact_address_',
            title: ' Address',
            type: types.STRING,
          },
          {
            key: 'contact_city_',
            title: 'City',
            type: types.STRING,
          },
          {
            key: 'contact_state_',
            title: 'State',
            type: types.SELECT,
            list: states,
          },
          {
            key: 'contact_zip_',
            title: 'Zip Code',
            type: types.INTEGER,
          },
          {
            key: 'contact_phone_',
            title: 'Phone Number',
            type: types.PHONE,
          },
          {
            key: 'contact_fax_',
            title: 'Fax Number',
            type: types.PHONE,
          },
          {
            key: 'contact_email_',
            title: 'Email address',
            type: types.EMAIL,
          },
        ],
      },
    ],
  },
  section2: {
    title: 'Additional Information',
    blocks: [
      {
        title: 'Section 2',
        data: [
          {
            key: 'eoc_will_be_sent_out_to',
            title: 'English EOCs are available on anthem.com/ca once members register and log in after they are enrolled. Electronic version of EOC will be sent out to:',
            type: types.RADIO,
            defaultItem: 'Group administrator',
            list: [
              'Group administrator',
              'Decision maker',
            ],
          },
          {
            key: 'max_hard_copy_quantities_per_product',
            title: 'Request max hard copy quantities (25) of each product?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
        ],
      },
    ],
  },
};

export default administrative;
