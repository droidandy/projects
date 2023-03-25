import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import { Grid, Table, Loader, Header, Segment, Form, Message, Button } from 'semantic-ui-react';
import PlanChanges from './components/PlanChanges';

class UploadPlanDesign extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    carriers: PropTypes.array.isRequired,
    selectedCarrier: PropTypes.object.isRequired,
    getChanges: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    uploadLoading: PropTypes.bool.isRequired,
    changeCarrier: PropTypes.func.isRequired,
    changes: PropTypes.object.isRequired,
    fileName: PropTypes.string.isRequired,
    inputYear: PropTypes.number.isRequired,
    changeYear: PropTypes.func.isRequired,
    uploadPlan: PropTypes.func.isRequired,
  };

  validateFile(acceptedFiles) {
    const { getChanges, selectedCarrier } = this.props;
    getChanges(selectedCarrier.name, (acceptedFiles) ? acceptedFiles[0] : null);
  }

  uploadFile(acceptedFiles) {
    const { uploadPlan, selectedCarrier } = this.props;
    uploadPlan(selectedCarrier.name, acceptedFiles.length ? acceptedFiles[0] : null);
  }

  render() {
    const { uploadLoading, changeYear, inputYear, changes, carriers, selectedCarrier, loading, fileName, changeCarrier } = this.props;
    const carrierList = carriers.map((item) => ({
      key: item.carrierId,
      value: item.carrierId,
      text: item.displayName,
    }));
    const currentYear = (new Date()).getFullYear();
    const yearList = [];
    for (let i = currentYear; i < currentYear + 10; i += 1) {
      yearList.push({ key: i, value: i, text: i });
    }
    return (
      <div className="upload-plan">
        <Helmet
          title="Plan Designs"
          meta={[
            { name: 'description', content: 'Plan Designs' },
          ]}
        />
        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Grid.Column>
              <Header as="h2">Update Plan Designs</Header>
              <div className="divider" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form>
                <Form.Group>
                  <Form.Dropdown
                    label="Choose a carrier"
                    placeholder="Choose carrier"
                    search
                    selection
                    options={carrierList}
                    value={selectedCarrier.carrierId}
                    onChange={(e, inputState) => { changeCarrier(inputState.value); }}
                  />
                  <Form.Dropdown
                    label="Choose a year"
                    placeholder="Choose year"
                    search
                    selection
                    options={yearList}
                    value={inputYear}
                    onChange={(e, inputState) => { changeYear(inputState.value); }}
                  />
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Table className="data-table" unstackable>
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="5">File</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row className="data-table-body">
                  <Table.Cell width="5" verticalAlign="top">
                    <p>Plan Design</p>
                    <div className="data-table-body-sub">{fileName}</div>
                  </Table.Cell>
                  <Table.Cell verticalAlign="middle">
                    <Loader inline="centered" active={loading} />
                    <div className="buttons-list">
                      { !loading &&
                        <Dropzone disableClick={loading} onDrop={(acceptedFiles) => { this.validateFile(acceptedFiles); }} className="drop-zone" multiple={false} activeClassName="active" rejectClassName="reject">
                          <Grid stackable>
                            <Grid.Row centered>
                              <Grid.Column width={8} textAlign="center" verticalAlign="middle">
                                Drag & Drop or ...
                              </Grid.Column>
                              <Grid.Column width={8} textAlign="center" verticalAlign="middle">
                                <Button primary size="medium" className="dropzone">Upload File</Button>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Dropzone>
                      }
                    </div>
                    <Loader inline active={false} />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>

        { fileName.length > 0 &&
          <Grid stackable as={Segment} className="gridSegment">
            <Grid.Row className="header-main">
              <Grid.Column>
                <Header as="h2">Changes</Header>
                <div className="divider" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              { changes.added && !changes.added.length && changes.removed && !changes.removed.length && changes.updated && !changes.updated.length ?
                (<Message warning>
                  <Message.Header>No changes detected!</Message.Header>
                  <p>There were no changes detected between the file you uploaded and the data we have stored, please check your file.</p>
                </Message>) :
                <PlanChanges
                  changes={changes}
                />
              }
            </Grid.Row>
          </Grid>
        }

        { fileName.length > 0 && ((changes.added && changes.added.length > 0) || (changes.removed && changes.removed.length > 0) || (changes.updated && changes.updated.length > 0)) ?
          (<Grid stackable as={Segment} className="gridSegment">
            <Grid.Row className="header-main">
              <Grid.Column>
                <Header as="h2">Upload</Header>
                <div className="divider" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Table className="data-table" unstackable>
                  <Table.Header>
                    <Table.Row className="data-table-head">
                      <Table.HeaderCell width="5">File</Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row className="data-table-body">
                      <Table.Cell width="5" verticalAlign="top">
                        <p>Plan Design</p>
                      </Table.Cell>
                      <Table.Cell verticalAlign="middle">
                        <Loader inline="centered" active={uploadLoading} />
                        <div className="buttons-list">
                          { !uploadLoading &&
                            <Dropzone disableClick={uploadLoading} onDrop={(acceptedFiles) => { this.uploadFile(acceptedFiles); }} className="drop-zone" multiple={false} activeClassName="active" rejectClassName="reject">
                              <Grid stackable>
                                <Grid.Row centered>
                                  <Grid.Column width={8} textAlign="center" verticalAlign="middle">
                                    Drag & Drop or ...
                                  </Grid.Column>
                                  <Grid.Column width={8} textAlign="center" verticalAlign="middle">
                                    <Button primary size="medium">Upload File</Button>
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            </Dropzone>
                          }
                        </div>
                        <Loader inline active={false} />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
          </Grid>) : ''
        }
      </div>
    );
  }
}

export default UploadPlanDesign;
