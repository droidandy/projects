import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { Upload, Row, Col } from 'antd';
import { Input, Checkbox } from 'components/form';
import { Icon, ButtonLink, Button } from 'components';
import { urlFor } from 'utils';

ReferenceOption.propTypes = {
  $: PropTypes.func,
  index: PropTypes.number,
  reference: PropTypes.object,
  handleFileUpload: PropTypes.func,
  handleRemoveAttachment: PropTypes.func,
  changeReferenceActive: PropTypes.func,
  changeReferenceCostCentre: PropTypes.func,
  anyCostCentreSelected: PropTypes.func
};

export default function ReferenceOption(props) {
  const {
    $,
    index,
    reference,
    handleFileUpload,
    handleRemoveAttachment,
    changeReferenceActive,
    changeReferenceCostCentre,
    anyCostCentreSelected
  } = props;

  const {
    active,
    dropdown,
    attachmentUrl,
    fileName,
    validationRequired,
    sftpServer,
    mandatory,
    costCentre,
    conditional
  } = reference || {};

  return (
    <div data-name="referenceOption">
      <label className="mb-5">Extra Field { index + 1 }:</label>
      <div className="mb-10 layout horizontal center">
        <Checkbox { ...$('active')(changeReferenceActive, index) } />
        <Input
          { ...$('name') }
          className="ml-10 flex"
          disabled={ !active || costCentre }
          />
      </div>
      <Row className="ml-25 mb-20 pl-5">
        <Col xs={ 12 }>
          <Checkbox
            { ...$('mandatory') }
            className="mb-5"
            disabled={ !active || conditional }
          >
            mandatory
          </Checkbox>
          <Checkbox
            { ...$('validationRequired') }
            className="mb-5"
            disabled={ !active || costCentre }
          >
            verify
          </Checkbox>
          <Checkbox
            { ...$('sftpServer') }
            disabled={ !active || !(validationRequired || dropdown) || costCentre }
          >
            SFTP server
          </Checkbox>
        </Col>
        <Col xs={ 12 }>
          <Checkbox
            { ...$('conditional') }
            className="mb-5"
            disabled={ !active || mandatory }
          >
            conditional
          </Checkbox>
          <Checkbox
            { ...$('dropdown') }
            className="mb-5 ml-30"
            disabled={ !active || costCentre }
          >
            dropdown
          </Checkbox>
          <Checkbox
            { ...$('costCentre')(changeReferenceCostCentre, index) }
            disabled={
              !active ||
              (!costCentre && anyCostCentreSelected()) ||
              validationRequired ||
              dropdown
            }
          >
            cost centre
          </Checkbox>
        </Col>
      </Row>
      { (validationRequired || dropdown) &&
        <div className="mb-10 ml-25">
          { !sftpServer &&
            <Upload
              { ...$('attachment')(handleFileUpload, index) }
              customRequest={ noop }
              showUploadList={ false }
              accept=".csv, text/csv"
            >
              <Button className="mr-10 mb-10" type="secondary" disabled={ !active }>
                <Icon className="text-20 mr-10" icon="MdFileUpload" />
                Upload CSV File
              </Button>
            </Upload>
          }
          <ButtonLink
            className="mb-10"
            type="secondary"
            href={ urlFor.statics('/csv_references_example.csv') }
            disabled={ !active }
            download
          >
            <Icon className="text-20 mr-10" icon="MdFileDownload" />
            CSV example
          </ButtonLink>
          { fileName &&
            <div className="horizontal layout">
              { attachmentUrl
                ? <a href={ attachmentUrl }>{ fileName }</a>
                : <div>{ fileName }</div>
              }
              <a className="ml-5 bold-text red-text" onClick={ () => handleRemoveAttachment(index) }>x</a>
            </div>
          }
        </div>
      }
    </div>
  );
}
