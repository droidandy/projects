import React from 'react';
import PropTypes from 'prop-types';
import { Header, Grid, Form, TextArea, Divider, Radio } from 'semantic-ui-react';
import { Dropzone } from '@benrevo/benrevo-react-core';
import { CHANGE_SUMMARY_FILES, RFP_MEDICAL_SECTION } from '../../constants';

class Files extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    filesSummary: PropTypes.array,
    removeFile: PropTypes.func,
    FileNote: PropTypes.func.isRequired,
    addFile: PropTypes.func,
    filesClaims: PropTypes.array,
    section: PropTypes.string,
    virgin: PropTypes.bool,
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { section, filesSummary, removeFile, addFile, filesClaims, FileNote, virgin } = this.props;
    return (
      <Grid.Row className="rfpRowDivider">
        <Grid.Column width={5}>
          <Header as="h3" className="rfpPageSectionHeading">Uploaded Files</Header>
        </Grid.Column>
        <Grid.Column width={11}>
          { !virgin &&
          <Header as="h3" className="rfpPageFormSetHeading">Please upload
            the {section === 'life' ? section : section.toUpperCase()} census
            and {section === 'life' ? section : section.toUpperCase()} benefit summaries</Header>
          }
          { virgin &&
          <Header as="h3" className="rfpPageFormSetHeading">Please upload the census</Header>
          }
          <FileNote />
          <Dropzone
            name="filesSummary"
            errorName={CHANGE_SUMMARY_FILES}
            section={section}
            accept="pdf, xlsx, docx, xlsm" files={filesSummary} maxSize={5242880}
            onRemove={(index) => { removeFile(section, 'filesSummary', index); }}
            onDrop={(files) => { addFile(section, 'filesSummary', files); }}
            multiple
          />
          { section === RFP_MEDICAL_SECTION &&
          <Header as="h3" className="rfpPageFormSetHeading">
            If currently on a Self-Funded Product, e.g. Level Funding or
            if you are fully insured with claims experience, please include the current carrier's renewal package,
            including experience reports, large claim report, current medical plans, renewal increases SSL, ASL, Claims
            Funding, and Admin Fee.
          </Header> ||
          <Header as="h3" className="rfpPageFormSetHeading">
            Please upload applicable claims experience
          </Header>
          }
          <Dropzone
            name="filesClaims"
            section={section}
            accept="pdf, xlsx, docx, xlsm" files={filesClaims} maxSize={5242880}
            onRemove={(index) => { removeFile(section, 'filesClaims', index); }}
            onDrop={(files) => { addFile(section, 'filesClaims', files); }}
            multiple
          />
        </Grid.Column>
        <Divider />
      </Grid.Row>
    );
  }
}

Files.propTypes = {
  section: PropTypes.string.isRequired,
};

export default Files;
