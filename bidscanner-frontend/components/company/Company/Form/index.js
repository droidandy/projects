// @flow
import React from 'react';
import styled from 'styled-components';

import { compose, withState, withHandlers } from 'recompose';

import { Field } from 'redux-form';
import { Flex, Box, Grid } from 'grid-styled';
import { Link } from 'next-url-prettifier';

import MenuItem from 'material-ui/MenuItem';

import WhiteButton from 'components/styled/WhiteButton';
import BlackButton from 'components/styled/BlackButton';
import Error from 'components/styled/SimpleError';

import Dialog from 'components/general/Dialog';

import Dropzone from 'components/forms-components/new/Dropzone';
import Editor from 'components/forms-components/new/Editor';
import GoogleMapsSearchInput from 'components/forms-components/new/ExtendedGoogleMapsSearchInput';
import Input from 'components/forms-components/new/Input';
import SelectField from 'components/forms-components/new/SelectField';
import Files from 'components/forms-components/Files';

import AddCertificateFormContainer from 'containers/company/Company/AddCertificateFormContainer';
import AddReferenceFormContainer from 'containers/company/Company/AddReferenceFormContainer';
import InviteUserFormContainer from 'containers/company/Company/InviteUserFormContainer';

import Certificates from './Certificates';
import Projects from './Projects';
import CompanyInvitations from './CompanyInvitations';
import CompanyApplications from './CompanyApplications';

const FieldGroup = styled(Box).attrs({ mb: 3 })``;

const FieldBox = styled(Flex).attrs({ mb: 1 })``;

const Label = styled.div`
  color: #bcbec0;
  font-size: 0.75em;
  margin-bottom: 8px;
`;

const enhance = compose(
  withState('certificateDialogOpened', 'setCertificateDialogOpened', false),
  withState('referenceDialogOpened', 'setReferenceDialogOpened', false),
  withState('invitationDialogOpened', 'setInvitationDialogOpened', false),
  withHandlers({
    onAddCertificate: props => () => {
      props.setCertificateDialogOpened(true);
    },
    onAddReference: props => () => {
      props.setReferenceDialogOpened(true);
    },
    onDialogClose: props => () => {
      props.setReferenceDialogOpened(false);
      props.setCertificateDialogOpened(false);
    },
  })
);

type RecomposeProps = {
  certificateDialogOpened: boolean,
  referenceDialogOpened: boolean,
  onAddCertificate: () => void,
  onAddReference: () => void,
  onDialogClose: () => void,
};

type ExternalProps = {
  companies: {}[],
  user: {},
};

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const {
    // add certificate modal
    certificateDialogOpened,
    onAddCertificate,
    // add reference modal
    referenceDialogOpened,
    onAddReference,
    // invite user modal
    invitationDialogOpened,
    setInvitationDialogOpened,
    // close every modal
    onDialogClose,

    // data
    companyTypes,
    businessTypes,

    // company,
    companyId,
    countryId,

    // redux-form controllers
    handleSubmit,
    pristine,
    error,
    submitting,

    // lists
    certificates,
    projects,
    invitations,

    applications,
    onAcceptCompanyApplication,
    onRejectCompanyApplication,
  } = props;

  // console.log('certificates');
  // console.log(certificates);
  // console.log(projects);
  // console.log(invitations);

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Label>Description</Label>
        <FieldBox>
          <Field
            name="description"
            component={Editor}
            placeholder="Company Description"
            infoText="Info about description field"
          />
        </FieldBox>
        <Field name="companyType" component={SelectField} placeholder="Company Type">
          {companyTypes &&
            companyTypes.map(type => <MenuItem key={type.id} value={type.id} primaryText={type.name} />)}
        </Field>
        <Field name="businessType" component={SelectField} placeholder="Legal Business Type">
          {businessTypes &&
            businessTypes.map(type => <MenuItem key={type.id} value={type.id} primaryText={type.name} />)}
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Label>Address and website</Label>
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
            name="website"
            component={Input}
            type="text"
            placeholder="Website"
            infoText="Info about website field"
          />
        </FieldBox>
      </FieldGroup>
      <FieldGroup>
        <Label>Company users</Label>
        <FieldBox>
          <Grid mr={1}>
            <WhiteButton type="button" onClick={() => setInvitationDialogOpened(true)}>
              invite new user
            </WhiteButton>
          </Grid>
          <Link href="/my/company/users">
            <WhiteButton.AsLink href="/my/company/users">all users</WhiteButton.AsLink>
          </Link>
        </FieldBox>
      </FieldGroup>
      <FieldGroup>
        <Label>Downloads</Label>
        <FieldBox>
          <Field name="files" component={Dropzone} infoText="Info about files field" />
        </FieldBox>
        <Label>Documents</Label>
        <FieldBox>
          <Field name="documents" component={Files} />
        </FieldBox>
        <Label>Photos</Label>
        <FieldBox>
          <Field name="photos" component={Files} />
        </FieldBox>
      </FieldGroup>
      <FieldGroup>
        <Label>Quality</Label>
        <Box mb={2}>
          <Certificates certificates={certificates} />
        </Box>
        <FieldBox>
          <WhiteButton type="button" onClick={onAddCertificate}>
            add certificate
          </WhiteButton>
        </FieldBox>
      </FieldGroup>
      <FieldGroup>
        <Label>References</Label>
        <Box mb={2}>
          <Projects projects={projects} />
        </Box>
        <FieldBox>
          <WhiteButton type="button" onClick={onAddReference}>
            add reference
          </WhiteButton>
        </FieldBox>
      </FieldGroup>
      <FieldGroup>
        <Label>Invitations</Label>
        <FieldBox>
          <CompanyInvitations invitations={invitations} />
        </FieldBox>
      </FieldGroup>
      <FieldGroup>
        <Label>Applications</Label>
        <FieldBox>
          <CompanyApplications
            applications={applications}
            onAcceptCompanyApplication={onAcceptCompanyApplication}
            onRejectCompanyApplication={onRejectCompanyApplication}
          />
        </FieldBox>
      </FieldGroup>
      <Error p={1}>{error}</Error>
      <Box mt={2} mb={1}>
        <BlackButton type="submit" disabled={submitting || pristine}>
          Update Company
        </BlackButton>
      </Box>
      {/* add certificat modal */}
      <Dialog open={certificateDialogOpened} onRequestClose={onDialogClose}>
        <AddCertificateFormContainer
          onCertificateAdded={onDialogClose}
          countryId={countryId}
          companyId={companyId}
        />
      </Dialog>
      {/* add reference modal */}
      <Dialog open={referenceDialogOpened} onRequestClose={onDialogClose}>
        <AddReferenceFormContainer companyId={companyId} />
      </Dialog>
      {/* invite user to a company modal */}
      <Dialog open={invitationDialogOpened} onRequestClose={() => setInvitationDialogOpened(false)}>
        <InviteUserFormContainer companyId={companyId} onSuccess={() => setInvitationDialogOpened(false)} />
      </Dialog>
    </form>
  );
});

export default EnhancedComponent;
