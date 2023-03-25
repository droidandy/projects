import React from 'react';
import styled from 'styled-components';

import { compose, withState, withHandlers, withProps } from 'recompose';

import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';
import Dialog from 'components/general/Dialog';
import CategoryDropdown from 'components/forms-components/new/CategoryDropdown';
import GoogleMapsSearchInput from 'components/forms-components/new/ExtendedGoogleMapsSearchInput';
import Input from 'components/forms-components/new/Input';
import SAInput from 'components/forms-components/new/ExtendedSAInput';
import NewCompanyFormContainer from 'containers/account/Account/NewCompanyFormContainer';
import CompanyReqDialogContentContainer from 'containers/account/Account/CompanyReqDialogContentContainer';
import BlackButton from 'components/styled/BlackButton';
import Error from 'components/styled/SimpleError';

import CompanyApplications from './CompanyApplications';
import CompanyInvitations from './CompanyInvitations';

const getCompanyName = company => company.name;

const FieldGroup = styled(Box).attrs({ mb: 3 })``;

const FieldBox = styled(Flex).attrs({ mb: 1 })``;

const Label = styled.div`
  color: #bcbec0;
  font-size: 0.75em;
  margin-bottom: 8px;
`;

const enhance = compose(
  withState('selectedCompany', 'setSelectedCompany', null),
  withState('newCompanyOpened', 'setNewCompanyOpened', false),
  withState('companyCreatedDialogOpened', 'setCompanyCreatedDialogOpened', false),
  withState('requestCreatedDialogOpened', 'setRequestCreatedDialogOpened', false),
  withHandlers({
    onAddCompany: props => () => {
      props.setNewCompanyOpened(true);
    },
    // close company creation modal & open success modal
    onCreateCompany: props => () => {
      props.setNewCompanyOpened(false);
      props.setCompanyCreatedDialogOpened(true);
    },
    // delete selected company (close company application request modal)
    onSendCompanyRequest: props => () => {
      props.setSelectedCompany(null);
      props.setRequestCreatedDialogOpened(true);
    },
    onCompanyFieldChange: props => company => {
      props.setSelectedCompany(company);
    },
    onNewCompanyClose: props => () => {
      props.setNewCompanyOpened(false);
    },
  }),
  withProps(({ companies, userId }) => ({
    companies: (companies && companies.filter(v => v.user.id !== userId)) || [],
  }))
);

const EnhancedComponent = enhance((
  // prettier-ignore
  {
    // dropdown with companies
    onCompanyFieldChange,
    companies,
    refetchCompanies,

    // send company application modal
    selectedCompany,
    setSelectedCompany,
    onSendCompanyRequest,
    // success modal
    requestCreatedDialogOpened,
    setRequestCreatedDialogOpened,

    // create company modal
    onAddCompany,
    newCompanyOpened,
    setNewCompanyOpened,
    onCreateCompany,
    // success modal
    companyCreatedDialogOpened,
    setCompanyCreatedDialogOpened,

    // subcategories dropdown
    macrocategories,

    // applications
    applications,
    refetchApplications,

    // invitations
    invitations,
    onAcceptCompanyInvitation,
    onRejectCompanyInvitation,

    // redux-form controllers
    handleSubmit,
    submitting,
    pristine,
    error,
  }
) => (
  <form onSubmit={handleSubmit}>
    <FieldGroup>
      <Label>Address and phone</Label>
      <FieldBox>
        <Field
          name="address"
          component={GoogleMapsSearchInput}
          placeholder="Address"
          infoText="Info about address field"
        />
      </FieldBox>
      <FieldBox>
        <Field
          name="phone"
          component={Input}
          type="text"
          placeholder="Phone"
          infoText="Info about phone field"
        />
      </FieldBox>
    </FieldGroup>
    <FieldGroup>
      <Label>Company:</Label>
      <FieldBox>
        <SAInput
          items={companies}
          getDisplayValue={getCompanyName}
          placeholder="Add Company"
          infoText="Info about company field"
          actionText="add your company"
          actionHint="Can't find your company?"
          onAction={onAddCompany}
          onChange={onCompanyFieldChange}
          onInputChange={filter =>
            refetchCompanies({
              query: filter,
            })}
          value={null}
        />
      </FieldBox>
      <Label>Applications:</Label>
      <FieldBox>
        <CompanyApplications applications={applications} />
      </FieldBox>
      <Label>Invitations:</Label>
      <FieldBox>
        <CompanyInvitations
          invitations={invitations}
          onAcceptCompanyInvitation={onAcceptCompanyInvitation}
          onRejectCompanyInvitation={onRejectCompanyInvitation}
        />
      </FieldBox>
    </FieldGroup>
    <FieldGroup>
      <Label>What I buy / sell</Label>
      <Label>(select up to 10 categories browsing our products / service classification)</Label>
      <FieldBox>
        <Field
          name="sellCategories"
          component={CategoryDropdown}
          macrocategories={macrocategories}
          placeholder="I sell"
          infoText="Info about sell field"
        />
      </FieldBox>
      <FieldBox>
        <Field
          name="buyCategories"
          component={CategoryDropdown}
          macrocategories={macrocategories}
          placeholder="I buy"
          infoText="Info about buy field"
        />
      </FieldBox>
    </FieldGroup>
    <Error p={1}>{error}</Error>
    <Box mt={2} mb={1}>
      <BlackButton type="submit" disabled={submitting || pristine}>
        Update Account
      </BlackButton>
    </Box>
    <Dialog open={!!selectedCompany} onRequestClose={() => setSelectedCompany(null)}>
      <CompanyReqDialogContentContainer
        selectedCompany={selectedCompany}
        onSendRequest={() => {
          onSendCompanyRequest();
          // TODO: error handling?
          refetchApplications();
        }}
      />
    </Dialog>
    <Dialog open={newCompanyOpened} onRequestClose={() => setNewCompanyOpened(false)}>
      <NewCompanyFormContainer onCreateCompany={onCreateCompany} />
    </Dialog>
    <Dialog open={companyCreatedDialogOpened} onRequestClose={() => setCompanyCreatedDialogOpened(false)}>
      <Box p={3}>Company is created!</Box>
    </Dialog>
    <Dialog open={requestCreatedDialogOpened} onRequestClose={() => setRequestCreatedDialogOpened(false)}>
      <Box p={3}>Request is sent!</Box>
    </Dialog>
  </form>
));

export default EnhancedComponent;
