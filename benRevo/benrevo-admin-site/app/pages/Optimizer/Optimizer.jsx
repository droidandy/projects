import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import { Segment, Grid, Header, Button, Table, Loader, Dimmer, Dropdown, Input, Form, Checkbox } from 'semantic-ui-react';
import Navigation from '../../pages/Client/Navigation';
import { STATES, BCC_EMAILS } from './constants';
import { selectedCarrier } from '../../config';

class Optimizer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loadOptimizer: PropTypes.func.isRequired,
    validateOptimizer: PropTypes.func.isRequired,
    gaGets: PropTypes.func.isRequired,
    brokerageGets: PropTypes.func.isRequired,
    changeProduct: PropTypes.func.isRequired,
    changeField: PropTypes.func.isRequired,
    changeAddress: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    newClientName: PropTypes.string.isRequired,
    overrideClient: PropTypes.bool.isRequired,
    brokerages: PropTypes.array.isRequired,
    ga: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    existingProducts: PropTypes.array.isRequired,
    products: PropTypes.object.isRequired,
    brokerage: PropTypes.object.isRequired,
    gaBrokerage: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    addressInfo: PropTypes.object.isRequired,
    selectedBrokerage: PropTypes.object.isRequired,
    bccEmail: PropTypes.string.isRequired,
    updateBCC: PropTypes.func.isRequired,
    changeEditing: PropTypes.func.isRequired,
    renewals: PropTypes.object.isRequired,
    changeRenewal: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.gaGets();
    this.props.brokerageGets();
  }

  uploadFile(acceptedFiles, add) {
    this.props.loadOptimizer((acceptedFiles) ? acceptedFiles[0] : null, add);
  }

  validateFile(acceptedFiles) {
    this.props.validateOptimizer((acceptedFiles) ? acceptedFiles[0] : null);
  }

  render() {
    const {
      loading,
      loaded,
      overrideClient,
      newClientName,
      errors,
      products,
      brokerage,
      gaBrokerage,
      client,
      brokerages,
      ga,
      addressInfo,
      changeField,
      changeAddress,
      selectedBrokerage,
      changeProduct,
      selectedGA,
      bccEmail,
      updateBCC,
      existingProducts,
      changeEditing,
      editing,
      renewals,
      changeRenewal,
    } = this.props;
    const anthem = selectedCarrier.value === 'ANTHEM_BLUE_CROSS';
    const uhc = selectedCarrier.value === 'UHC';
    const selectedBrokerageFilled = selectedBrokerage.address && selectedBrokerage.city && selectedBrokerage.state && selectedBrokerage.zip;
    const brokerageFilled = brokerage.address && brokerage.city && brokerage.state && brokerage.zip;
    const showAddress = (!brokerageFilled && (brokerage.id === 0 || brokerage.id === null)) || (selectedBrokerage.id && !selectedBrokerageFilled);
    let disabledUploadButton = loading
      || (!products.medical && !products.dental && !products.vision)
      || ((brokerage.id && !selectedBrokerage.id)
      || (showAddress && !(addressInfo.address && addressInfo.city && addressInfo.state && addressInfo.zip))
      || (client.id && !overrideClient && !newClientName)
      || (!brokerage.id && anthem && !bccEmail)
      || (gaBrokerage.id && !selectedGA));

    const TableElement = (props) => <Table className="data-table basic" unstackable>
      <Table.Header>
        <Table.Row className="data-table-head">
          <Table.HeaderCell width="8"><div className="header3">The {(props.type === 'gaBrokerage') ? 'GA' : 'BROKERAGE'} already exists. Choose another:</div></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row className="data-table-body">
          <Table.Cell verticalAlign="top">
            <Grid>
              <Grid.Row>
                <Grid.Column width="8">
                  <Dropdown
                    placeholder="Choose"
                    search
                    selection
                    options={props.list}
                    value={props.elemId || ''}
                    onChange={(e, inputState) => { changeField(props.selected, inputState.value); }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>;
    let canAdd = existingProducts.length > 0;

    for (let i = 0; i < existingProducts.length; i += 1) {
      const product = existingProducts[i];
      if (product.category && products[product.category.toLowerCase()]) canAdd = false;
    }

    if (!editing && canAdd) disabledUploadButton = false;

    if (!products.medical && !products.dental && !products.vision) canAdd = false;

    return (
      <div className="optimizer-anthem">
        <Helmet
          title="Optimizer"
          meta={[
            { name: 'description', content: 'Description of Optimizer' },
          ]}
        />
        <Navigation />
        <Grid stackable container className="requests section-wrap" key="optimizer">
          <Grid.Row>
            <Grid.Column width={16}>
              <Grid stackable as={Segment} className="gridSegment">
                <Grid.Row className="header-main">
                  <Header as="h2">Choose the Products</Header>
                  <div className="divider" />
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width="4">
                    <div className="header3">Products</div>
                  </Grid.Column>
                  <Grid.Column width="12">
                    <Table className="data-table basic" unstackable>
                      <Table.Header>
                        <Table.Row className="data-table-head">
                          <Table.HeaderCell width="16"><div className="header3">Please select at least one product</div></Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      { !uhc &&
                      <Table.Body>
                        <Table.Row className="data-table-body">
                          <Table.Cell width="16" verticalAlign="top">
                            <Grid>
                              <Grid.Row>
                                <Grid.Column width="16">
                                  <Form>
                                    <Form.Group inline>
                                      <Form.Checkbox
                                        label="Medical"
                                        checked={products.medical}
                                        onChange={(e, inputState) => { changeProduct('medical', inputState.checked); }}
                                      />
                                      <Form.Checkbox
                                        label="Dental"
                                        checked={products.dental}
                                        onChange={(e, inputState) => { changeProduct('dental', inputState.checked); }}

                                      />
                                      <Form.Checkbox
                                        label="Vision"
                                        checked={products.vision}
                                        onChange={(e, inputState) => { changeProduct('vision', inputState.checked); }}
                                      />
                                    </Form.Group>
                                  </Form>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                      }
                      { uhc &&
                        <Table.Body>
                          <Table.Row className="data-table-body" cellAs="div">
                            <Table.Cell width={6}>
                              <Checkbox
                                label="Medical"
                                checked={products.medical}
                                onChange={(e, inputState) => { changeProduct('medical', inputState.checked); }}
                              />
                            </Table.Cell>
                            <Table.Cell width={10} verticalAlign="middle">
                              <Form>
                                <Form.Group inline>
                                  <span className="radio-label">Is this a renewal?</span>
                                  <Form.Radio label="Yes" value="Yes" checked={renewals.medical} onChange={(e, inputState) => { changeRenewal('medical', inputState.value); }} />
                                  <Form.Radio label="No" value="No" checked={!renewals.medical} onChange={(e, inputState) => { changeRenewal('medical', inputState.value); }} />
                                </Form.Group>
                              </Form>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row className="data-table-body" cellAs="div">
                            <Table.Cell width={6}>
                              <Checkbox
                                label="Dental"
                                checked={products.dental}
                                onChange={(e, inputState) => { changeProduct('dental', inputState.checked); }}
                              />
                            </Table.Cell>
                            <Table.Cell width={10} verticalAlign="middle">
                              <Form>
                                <Form.Group inline>
                                  <span className="radio-label">Is this a renewal?</span>
                                  <Form.Radio label="Yes" value="Yes" checked={renewals.dental} onChange={(e, inputState) => { changeRenewal('dental', inputState.value); }} />
                                  <Form.Radio label="No" value="No" checked={!renewals.dental} onChange={(e, inputState) => { changeRenewal('dental', inputState.value); }} />
                                </Form.Group>
                              </Form>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row className="data-table-body" cellAs="div">
                            <Table.Cell width={6}>
                              <Checkbox
                                label="Vision"
                                checked={products.vision}
                                onChange={(e, inputState) => { changeProduct('vision', inputState.checked); }}
                              />
                            </Table.Cell>
                            <Table.Cell width={10} verticalAlign="middle">
                              <Form>
                                <Form.Group inline>
                                  <span className="radio-label">Is this a renewal?</span>
                                  <Form.Radio label="Yes" value="Yes" checked={renewals.vision} onChange={(e, inputState) => { changeRenewal('vision', inputState.value); }} />
                                  <Form.Radio label="No" value="No" checked={!renewals.vision} onChange={(e, inputState) => { changeRenewal('vision', inputState.value); }} />
                                </Form.Group>
                              </Form>
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      }
                    </Table>
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              <Grid stackable as={Segment} className="gridSegment">
                <Grid.Row className="header-main">
                  <Header as="h2">Validate Optimizer</Header>
                  <div className="divider" />
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
                        <Table.Cell width="5" verticalAlign="top">Optimizer</Table.Cell>
                        <Table.Cell verticalAlign="middle">
                          <div className="buttons-list">
                            <Dropzone disableClick={loading || (!products.medical && !products.dental && !products.vision)} onDrop={(acceptedFiles) => { this.validateFile(acceptedFiles); }} className="drop-zone" multiple={false} activeClassName="active" rejectClassName="reject">
                              <Button disabled={loading || (!products.medical && !products.dental && !products.vision)} size="big" color="grey" className="upload-separate not-link-button" primary>Validate</Button>
                            </Dropzone>
                          </div>
                          <Loader inline active={loading} />
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Grid.Row>
              </Grid>

              <Grid stackable as={Segment} className="gridSegment">
                <Grid.Row className="header-main">
                  <Header as="h2">Errors</Header>
                  <div className="divider" />
                </Grid.Row>
                <Grid.Row>
                  <Dimmer active={loading} inverted>
                    <Loader indeterminate size="large">Getting optimizer info</Loader>
                  </Dimmer>
                  { errors.length > 0 &&
                  <Table className="data-table" unstackable>
                    <Table.Header>
                      <Table.Row className="data-table-head">
                        <Table.HeaderCell>Title</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {errors.map((error, index) =>
                        <Table.Row key={index} className="data-table-body">
                          <Table.Cell verticalAlign="top">
                            {error}
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table>
                  }
                  { !errors.length &&
                  <div className="empty">
                    { !loading && 'No errors for this optimizer' }
                  </div>
                  }
                </Grid.Row>
              </Grid>

              {loaded && !errors.length && (brokerage.id || gaBrokerage.id || client.id || showAddress) &&
              <Grid stackable as={Segment} className="optimizer-info gridSegment">

                <Grid.Row className="header-main">
                  <Header as="h2">Edit</Header>
                  <div className="divider" />
                </Grid.Row>
                <Dimmer active={loading} inverted>
                  <Loader indeterminate size="large">Getting optimizer info</Loader>
                </Dimmer>

                { canAdd &&
                <Grid.Row>
                  <Grid.Column width="16" textAlign="center">
                    <div className="header3">
                      For add a product to an existing client, just click {'"Upload"'} or you can create a new client.
                    </div>
                  </Grid.Column>
                </Grid.Row>
                }

                { canAdd &&
                <Grid.Row>
                  <Grid.Column width="16" textAlign="center">
                    <a tabIndex={0} className="change-client" onClick={() => { changeEditing(!editing); }}>{ !editing && 'I want to change the client' }{ editing && 'I want to add product' }</a>
                  </Grid.Column>
                </Grid.Row>
                }

                { brokerage.id > 0 && (editing || !canAdd) &&
                <Grid.Row>
                  <Grid.Column width="4">
                    <div className="header3">Brokerage</div>
                  </Grid.Column>
                  <Grid.Column width="12">
                    <TableElement
                      /* The brokerage dropdown CANNOT be left unselected if the brokerage already exists */
                      current={brokerage}
                      type="brokerage"
                      list={brokerages}
                      elemId={selectedBrokerage.id}
                      selected={'selectedBrokerage'}
                    />
                  </Grid.Column>
                </Grid.Row>
                }

                { brokerage.id > 0 && showAddress && (editing || !canAdd) &&
                  <Grid.Row>
                    <div className="divider" />
                  </Grid.Row>
                }

                { showAddress && (editing || !canAdd) &&
                <Grid.Row>
                  <Grid.Column width="4">
                    <div className="header3">Brokerage Address</div>
                  </Grid.Column>
                  <Grid.Column width="12">
                    <Table className="data-table basic" unstackable>
                      <Table.Header>
                        <Table.Row className="data-table-head">
                          <Table.HeaderCell width="16"><div className="header3">The BROKERAGE does not have an address. Write it ...</div></Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row className="data-table-body">
                          <Table.Cell width="16" verticalAlign="top">
                            <Grid>
                              <Grid.Row>
                                <Grid.Column width="16">
                                  <Form>
                                    <Form.Field>
                                      <Input
                                        placeholder="Enter address"
                                        value={addressInfo.address}
                                        onChange={(e, inputState) => { changeAddress('address', inputState.value); }}
                                      />
                                    </Form.Field>
                                    <Form.Field id="CITY">
                                      <Input
                                        placeholder="Enter city"
                                        value={addressInfo.city}
                                        onChange={(e, inputState) => { changeAddress('city', inputState.value); }}
                                      />
                                    </Form.Field>
                                    <Form.Field>
                                      <Dropdown
                                        placeholder="Select state" search selection options={STATES} value={addressInfo.state}
                                        onChange={(e, inputState) => { changeAddress('state', inputState.value); }}
                                      />
                                    </Form.Field>
                                    <Form.Group inline>
                                      <Form.Field>
                                        <Input
                                          placeholder="Enter ZIP code"
                                          value={addressInfo.zip}
                                          onChange={(e, inputState) => { changeAddress('zip', inputState.value); }}
                                        />
                                      </Form.Field>
                                    </Form.Group>
                                  </Form>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </Grid.Column>
                </Grid.Row>
                }

                { gaBrokerage.id && (editing || !canAdd) &&
                <Grid.Row>
                  <div className="divider" />
                </Grid.Row>
                }

                { gaBrokerage.id && (editing || !canAdd) &&
                <Grid.Row>
                  <Grid.Column width="4">
                    <div className="header3">GA</div>
                  </Grid.Column>
                  <Grid.Column width="12">
                    <TableElement
                      current={gaBrokerage}
                      type="gaBrokerage"
                      list={ga}
                      elemId={selectedGA}
                      selected={'selectedGA'}
                    />
                  </Grid.Column>
                </Grid.Row>
                }

                { client.id && (editing || !canAdd) &&
                <Grid.Row>
                  <div className="divider" />
                </Grid.Row>
                }

                { client.id && (editing || !canAdd) &&
                /* The client section's options have to be chosen. At least one. */
                <Grid.Row>
                  <Grid.Column width="4">
                    <div className="header3">Client</div>
                  </Grid.Column>
                  <Grid.Column width="12">
                    <Table className="data-table basic" unstackable>
                      <Table.Header>
                        <Table.Row className="data-table-head">
                          {/* <Table.HeaderCell width="8"><div className="header3">The CLIENT already exists. Override him...</div></Table.HeaderCell> */}
                          <Table.HeaderCell width="16"><div className="header3">The CLIENT already exists. Change the name...</div></Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row className="data-table-body">
                          {/* <Table.Cell width="8" verticalAlign="top">
                            <Grid>
                              <Grid.Row>
                                <Grid.Column width="3">
                                  <Radio
                                    value="yes"
                                    checked={overrideClient}
                                    onChange={(e, inputState) => { changeField('overrideClient', inputState.value === 'yes'); }}
                                  />
                                </Grid.Column>
                                <Grid.Column width="12">
                                  Override client
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Table.Cell> */}
                          <Table.Cell width="16" verticalAlign="top">
                            <Grid>
                              <Grid.Row>
                                {/* <Grid.Column width="3">
                                  <Radio
                                    value="no"
                                    checked={!overrideClient}
                                    onChange={(e, inputState) => { changeField('overrideClient', inputState.value === 'yes'); }}
                                  />
                                </Grid.Column> */}
                                <Grid.Column width="16">
                                  <Form>
                                    <Form.Field>
                                      <Input placeholder="New name" value={newClientName} onChange={(e, inputState) => { changeField('newClientName', inputState.value); }} />
                                    </Form.Field>
                                  </Form>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </Grid.Column>
                </Grid.Row>
                }

                { !brokerage.id && (editing || !canAdd) && anthem &&
                  <Grid.Row>
                    <div className="divider" />
                  </Grid.Row>
                }

                { !brokerage.id && (editing || !canAdd) && anthem &&
                  <Grid.Row>
                    <Grid.Column width="4">
                      <span className="header3">Include BCC</span>
                    </Grid.Column>
                    <Grid.Column width="12">
                      <Table className="data-table basic" unstackable>
                        <Table.Header>
                          <Table.Row className="data-table-head">
                            <Table.HeaderCell width="16"><div className="header3">Select a BCC Email</div></Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <Table.Row className="data-table-body">
                            <Table.Cell width="16" verticalAlign="top">
                              <Grid>
                                <Grid.Row>
                                  <Grid.Column width="16">
                                    <Form>
                                      <Form.Field>
                                        <Dropdown
                                          placeholder="Select BCC email" search selection options={BCC_EMAILS} value={bccEmail}
                                          onChange={(e, inputState) => { updateBCC(inputState.value); }}
                                        />
                                      </Form.Field>
                                    </Form>
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    </Grid.Column>
                  </Grid.Row>
                }
              </Grid>
              }

              <Grid stackable as={Segment} className="gridSegment">
                <Grid.Row className="header-main">
                  <Header as="h2">Upload Optimizer</Header>
                  <div className="divider" />
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
                        <Table.Cell width="5" verticalAlign="top">Optimizer</Table.Cell>
                        <Table.Cell verticalAlign="middle">
                          <div className="buttons-list">
                            <Dropzone disableClick={disabledUploadButton} onDrop={(acceptedFiles) => { this.uploadFile(acceptedFiles, (!editing && canAdd)); }} className="drop-zone" multiple={false} activeClassName="active" rejectClassName="reject">
                              <Button
                                disabled={disabledUploadButton}
                                size="big"
                                color="orange"
                                className="upload-separate not-link-button"
                                primary
                              >Upload
                              </Button>
                            </Dropzone>
                          </div>
                          <Loader inline active={loading} />
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Optimizer;
