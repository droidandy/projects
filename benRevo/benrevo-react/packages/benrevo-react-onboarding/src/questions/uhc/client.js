import * as types from '../../types';
const administrative = {
  section1: {
    title: 'Client Information',
    blocks: [
      {
        title: 'Point of Contact',
        data: [
          {
            key: 'day_to_day_contact_name',
            title: 'Contact name',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'title',
            title: 'Contact title',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'address',
            title: 'Contact address / PO Box',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'city_state_zip',
            title: 'Contact City, State, Zip',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'office_telephone_number',
            title: 'Contact office telephone number',
            placeholder: '',
            type: types.PHONE,
          },
          {
            key: 'fax_number',
            title: 'Contact fax number',
            placeholder: '',
            type: types.PHONE,
          },
          {
            key: 'email_address',
            title: 'Contact E-mail address',
            placeholder: '',
            type: types.EMAIL,
          },
          {
            key: 'authorized_signer_for_group_name',
            title: 'Authorized signer for group name',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'authorized_signer_for_group_title',
            title: 'Authorized signer for group title',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'authorized_signer_email',
            title: 'Authorized signer email address',
            placeholder: '',
            type: types.EMAIL,
          },
        ],
      },
    ],
  },
  section2: {
    title: 'Client Information',
    blocks: [
      {
        title: 'Billing contact',
        data: [
          {
            key: 'billing_contact_name',
            title: 'Billing contact name',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'billing_contact_title',
            title: 'Title',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'billing_contact_address',
            title: 'Address / PO Box',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'billing_contact_city_state_zip',
            title: 'City, State, Zip',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'billing_contact_office_telephone_number',
            title: 'Office telephone number',
            placeholder: '',
            type: types.PHONE,
          },
          {
            key: 'billing_contact_fax_number',
            title: 'Fax Number',
            placeholder: '',
            type: types.PHONE,
          },
          {
            key: 'billing_contact_email_address',
            title: 'E-mail',
            placeholder: '',
            type: types.EMAIL,
          },
        ],
      },
    ],
  },
};

export default administrative;
