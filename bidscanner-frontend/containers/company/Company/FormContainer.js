import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { withProps } from 'recompose';

// import splitFilesToDocsPhotos from 'components/forms-components/new/Dropzone/splitFilesToDocsPhotos';

import addressDataToString from 'utils/addressDataToString';
import addressDataToAddressInput from 'utils/addressDataToAddressInput';

import Form from 'components/company/Company/Form';

const COMPANY_QUERY = gql`
  query company($id: UUID!) {
    company(id: $id) {
      id
      name
      company_type {
        id
        name
      }
      business_type {
        id
        name
      }
      description
      address {
        id
        postal_code
        street_number
        street_name
        city
        country {
          id
          iso_3166_1_alpha_2
        }
        region {
          id
        }
      }
      logo {
        id
        images {
          id
          bucket_key
        }
      }
      website
      documents {
        id
        filename
      }
      photos {
        id
        title
        images {
          id
          bucket_key
        }
      }
      projects {
        id
        currency {
          id
          name
        }
        description
        name
        value
        year
      }
      certificates {
        id
        certification {
          id
          name
        }
        expires_at
      }
      applications {
        edges {
          id
          user {
            id
            email {
              address
            }
            first_name
            last_name
          }
          accepted_at
          rejected_at
        }
      }
      invitations {
        edges {
          id
          user {
            id
            email {
              address
            }
            first_name
            last_name
          }
          accepted_at
          rejected_at
        }
      }
    }
  }
`;

const COMPANY_TYPES_QUERY = gql`
  query {
    company_types {
      edges {
        id
        name
      }
    }
  }
`;

const BUSINESS_TYPES_QUERY = gql`
  query {
    business_types {
      edges {
        id
        name
      }
    }
  }
`;

const UPDATE_COMPANY_MUTATION = gql`
  mutation($companyId: UUID!, $input: CompanyInput!) {
    update_company(id: $companyId, input: $input) {
      id
    }
  }
`;

const REJECT_COMPANY_APPLICATION_MUTATION = gql`
  mutation($applicationId: UUID!) {
    reject_company_application(id: $applicationId) {
      id
      rejected_at
      accepted_at
    }
  }
`;

const ACCEPT_COMPANY_APPLICATION_MUTATION = gql`
  mutation($applicationId: UUID!) {
    accept_company_application(id: $applicationId) {
      id
      rejected_at
      accepted_at
    }
  }
`;

export default compose(
  // recieve companyId as a prop
  graphql(COMPANY_QUERY, {
    name: 'company',
    skip: ({ companyId }) => !companyId,
    options: ({ companyId }) => ({
      variables: {
        id: companyId,
      },
    }),
    props: ({ company }) => ({
      // rewrite to not forget
      companyId: get(company, 'company.id'),
      countryId: get(company, 'company.address.country.id'),
      // data for initialization
      website: get(company, 'company.website'),
      address: get(company, 'company.address'),
      description: get(company, 'company.description'),
      companyType: get(company, 'company.company_type.id'),
      businessType: get(company, 'company.business_type.id'),
      logo: get(company, 'company.logo'),
      companyName: get(company, 'company.name'),
      // lists
      applications: get(company, 'company.applications.edges'),
      invitations: get(company, 'company.invitations.edges'),
      projects: get(company, 'company.projects'),
      certificates: get(company, 'company.certificates'),
      documents: get(company, 'company.documents'),
      photos: get(company, 'photos'),
    }),
  }),
  // redux-form initialization
  withProps(({ website, address, description, companyType, businessType, documents, photos }) => {
    const asObject = addressDataToAddressInput(address);
    const asString = addressDataToString(address);
    return {
      initialValues: {
        website,
        address: {
          asString,
          asObject,
        },
        documents: {
          data: documents || [],
          objectMapper: doc => ({ ...doc, name: doc.filename }),
        },
        photos: {
          data: photos || [],
          objectMapper: photo => ({ ...photo, name: photo.title }),
        },
        description,
        companyType,
        businessType,
      },
    };
  }),
  // company type & business types
  graphql(COMPANY_TYPES_QUERY, {
    name: 'companyTypes',
    props: ({ companyTypes }) => ({
      companyTypes: get(companyTypes, 'company_types.edges'),
    }),
  }),
  graphql(BUSINESS_TYPES_QUERY, {
    name: 'businessTypes',
    props: ({ businessTypes }) => ({
      businessTypes: get(businessTypes, 'business_types.edges'),
    }),
  }),
  // working with applications
  graphql(ACCEPT_COMPANY_APPLICATION_MUTATION, {
    props: ({ mutate }) => ({
      onAcceptCompanyApplication: async applicationId => {
        try {
          await mutate({
            variables: {
              applicationId,
            },
          });
        } catch (e) {
          throw new Error('Something has happened during while accepting the application');
        }
      },
    }),
  }),
  graphql(REJECT_COMPANY_APPLICATION_MUTATION, {
    props: ({ mutate }) => ({
      onRejectCompanyApplication: async applicationId => {
        try {
          await mutate({
            variables: {
              applicationId,
            },
          });
        } catch (e) {
          throw new Error('Something has happened during while rejecting the application');
        }
      },
    }),
  }),
  // submit mutation
  graphql(UPDATE_COMPANY_MUTATION, {
    props: ({ mutate, ownProps: { companyId, logo, companyName } }) => ({
      onSubmit: async formValues => {
        // looking throught current form's values
        const { address, businessType, companyType, description, website } = formValues;

        const input = {
          address: {
            ...address.asObject,
            location: {
              latitude: Math.random(),
              longitude: Math.random(),
            },
          },
          business_type_id: businessType,
          company_type_id: companyType,
          description,
          logo_id: logo.id,
          name: companyName,
          website,
          documents: [],
          photos: [],
        };

        try {
          await mutate({
            variables: {
              companyId,
              input,
            },
          });
        } catch (err) {
          throw new SubmissionError({
            _error: 'Something has happened',
          });
        }
        // console.log('Success!');
        // const logoId = get(company, 'logo.id');

        // const { documents, photos } = splitFilesToDocsPhotos(values.files);

        // const input = {
        //   address: values.address.asObject,
        //   business_type_id: values.legalBusinessType,
        //   company_type_id: values.companyType,
        //   description: values.description,
        //   documents,
        //   'logo-id': logoId,
        //   name: values.name,
        //   photos,
        //   website: values.website,
        // };

        // switch (fieldName) {
        //   case 'files':
        //     try {
        //       const files = data;
        //       const { documents, photos } = splitFilesToDocsPhotos(files);

        //       await updateCompany({
        //         variables: {
        //           companyId,
        //           input: {
        //             ...input,
        //             documents,
        //             photos,
        //           },
        //         },
        //       });
        //     } catch (err) {
        //       throw new SubmissionError({
        //         [fieldName]: err.message,
        //         _error: err.message,
        //       });
        //     }
        //     break;
        //   default:
        //     throw new SubmissionError({
        //       _error: 'Something has happened',
        //     });
        // }
      },
    }),
  }),
  reduxForm({
    form: 'my-company',
  })
)(Form);
