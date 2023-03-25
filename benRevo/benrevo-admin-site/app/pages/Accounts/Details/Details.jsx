import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { Grid, Segment, Header, Button, Table, Radio, Dropdown, Modal, Form, Loader } from 'semantic-ui-react';
import * as types from '../constants';
import { BCC_EMAILS } from '../../Optimizer/constants';
import { selectedCarrier } from '../../../config';
import states from './states';

class Details extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    current: PropTypes.object.isRequired,
    editingCurrent: PropTypes.object.isRequired,
    ga: PropTypes.array.isRequired,
    presales: PropTypes.array.isRequired,
    sales: PropTypes.array.isRequired,
    brokerages: PropTypes.array.isRequired,
    changeField: PropTypes.func.isRequired,
    changeInfo: PropTypes.func.isRequired,
    cancelChangeInfo: PropTypes.func.isRequired,
    saveInfo: PropTypes.func.isRequired,
    approve: PropTypes.func.isRequired,
    bccEmail: PropTypes.string.isRequired,
    updateBCC: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      type: null,
      changingExisting: false,
    };

    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.onChangePerson = this.onChangePerson.bind(this);
    this.onChangeDropDown = this.onChangeDropDown.bind(this);
    this.onCancelChangeInfo = this.onCancelChangeInfo.bind(this);
    this.onOpenChangeInfo = this.onOpenChangeInfo.bind(this);
    this.onChangeInfoHandler = this.onChangeInfoHandler.bind(this);
    this.onSaveInfo = this.onSaveInfo.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
  }

  componentWillReceiveProps() {
    if (this.state.changingExisting) {
      this.setState({ changingExisting: false }, () => {
        this.props.saveInfo();
      });
    }
  }

  onChangeRadio(name, value, dropDown) {
    this.props.changeField(name, value === 'no');

    this.setState({ changingExisting: true }, () => {
      if (dropDown.id && value === 'no') {
        this.props.changeInfo((name === 'isExistingGA' ? 'gaId' : 'brokerId'), dropDown.id);
      } else {
        this.props.changeInfo((name === 'isExistingGA' ? 'gaId' : 'brokerId'), null);
      }
    });
  }

  onChangePerson(name, value) {
    this.setState({ changingExisting: true }, () => {
      this.props.changeInfo(name, value);
    });
  }

  onChangeDropDown(name, value, radio) {
    this.props.changeField(name, value);

    this.setState({ changingExisting: true }, () => {
      if (radio) {
        this.props.changeInfo((name === 'selectedGA' ? 'gaId' : 'brokerId'), value);
      } else {
        this.props.changeInfo((name === 'selectedGA' ? 'gaId' : 'brokerId'), null);
      }
    });
  }

  onOpenChangeInfo(type) {
    this.setState({ type });
    this.modalToggle();
  }

  onCancelChangeInfo() {
    this.props.cancelChangeInfo();
    this.modalToggle();
  }

  onChangeInfoHandler(e, inputState) {
    this.props.changeInfo(e.target.name, inputState.value);
  }

  onSaveInfo() {
    this.props.saveInfo();
    this.modalToggle();
  }

  modalToggle() {
    const close = !this.state.modalOpen;
    this.setState({ modalOpen: close });
  }

  render() {
    const { bccEmail, updateBCC, loading, current, ga, brokerages, editingCurrent, approve, presales, sales } = this.props;
    const { type } = this.state;
    const anthem = selectedCarrier.value === 'ANTHEM_BLUE_CROSS';
    const TableElement = (props) => <Table className="data-table basic" unstackable>
      <Table.Header>
        <Table.Row className="data-table-head">
          <Table.HeaderCell width="8">Add new {(props.type === types.GA) ? 'GA' : 'BROKERAGE'} information...</Table.HeaderCell>
          <Table.HeaderCell width="8">Or choose existing {(props.type === types.GA) ? 'GA' : 'BROKERAGE'}...</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>

        <Table.Row className="data-table-body">
          <Table.Cell verticalAlign="top">
            <Grid>
              <Grid.Row>
                <Grid.Column width="3">
                  <Radio value="yes" checked={!this.props[props.radio]} onChange={(e, inputState) => { this.onChangeRadio(props.radio, inputState.value, this.props[props.selected]); }} />
                </Grid.Column>
                <Grid.Column width="12">
                  <div>{props.current[`${props.type}Name`]}</div>
                  <div>{props.current[`${props.type}Address`]}</div>
                  <div>{props.current[`${props.type}City`]}{props.current[`${props.type}City`] ? ',' : ''} {props.current[`${props.type}State`]} {props.current[`${props.type}Zip`]}</div>
                  { props.type === types.GA && <div>{props.current.agentName}</div> }
                  <div>{props.current[(props.type === types.GA) ? 'agentEmail' : 'brokerEmail']}</div>
                  <div><a className="btn" tabIndex={0} onClick={() => { this.onOpenChangeInfo(props.type); }}>Edit</a></div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Table.Cell>
          <Table.Cell verticalAlign="top">
            <Grid>
              <Grid.Row>
                <Grid.Column width="3">
                  <Radio value="no" checked={this.props[props.radio]} onChange={(e, inputState) => { this.onChangeRadio(props.radio, inputState.value, this.props[props.selected]); }} />
                </Grid.Column>
                <Grid.Column width="12">
                  <Dropdown
                    placeholder="Choose"
                    search
                    selection
                    options={props.list}
                    value={this.props[props.selected].id || ''}
                    onChange={(e, inputState) => { this.onChangeDropDown(props.selected, inputState.value, this.props[props.radio]); }}
                  />
                  { this.props[props.selected].id &&
                    <div>
                      <div>{this.props[props.selected].name}</div>
                      <div>{this.props[props.selected].address}</div>
                      <div>{this.props[props.selected].city}{this.props[props.selected].city ? ',' : ''} {this.props[props.selected].state} {this.props[props.selected].zip}</div>
                    </div>
                  }

                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>;
    return (
      <div>
        <Link to="/accounts" className="back">{'<'} Back to Account request list</Link>
        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Helmet
              title="Request detail"
              meta={[
                { name: 'description', content: 'Description of Request Detail' },
              ]}
            />
            <div>
              <Header as="h2">Request detail</Header>
            </div>
            <div className="meta-info">
              <div><span>Date</span> {current.created}</div>
              <div><span>ID</span> {current.id}</div>
            </div>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="4">
              <div className="header3">Step 1 - GA</div>
            </Grid.Column>
            <Grid.Column width="12">
              <TableElement
                current={current}
                type={types.GA}
                radio={'isExistingGA'}
                list={ga}
                selected={'selectedGA'}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="4">
              <div className="header3">Step 2 - Brokerage</div>
            </Grid.Column>
            <Grid.Column width="12">
              <TableElement
                current={current}
                type={types.BROKERAGE}
                radio={'isExistingBrokerage'}
                list={brokerages}
                selected={'selectedBrokerage'}
              />
            </Grid.Column>
          </Grid.Row>
          { !current.brokerId && <Grid.Row>
            <div className="divider" />
          </Grid.Row> }
          { !current.brokerId && <Grid.Row>
            <Grid.Column width="4">
              <div className="header3">Step 3 - Sales and Presales</div>
            </Grid.Column>
            <Grid.Column width="12">
              <Table className="data-table basic" unstackable>
                <Table.Header>
                  <Table.Row className="data-table-head">
                    <Table.HeaderCell width="8">Select SALES person</Table.HeaderCell>
                    <Table.HeaderCell width="8">Select PRESALES person</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row className="data-table-body">
                    <Table.Cell verticalAlign="top">
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width="15">
                            <Dropdown
                              placeholder="Choose"
                              search
                              selection
                              options={sales}
                              value={editingCurrent.brokerSalesName}
                              onChange={(e, inputState) => { this.onChangePerson('brokerSalesName', inputState.value); }}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Table.Cell>
                    <Table.Cell verticalAlign="top">
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width="15">
                            <Dropdown
                              placeholder="Choose"
                              search
                              selection
                              options={presales}
                              value={editingCurrent.brokerPresaleName}
                              onChange={(e, inputState) => { this.onChangePerson('brokerPresaleName', inputState.value); }}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row> }
          { !current.brokerId && anthem &&
            <Grid.Row>
              <div className="divider" />
            </Grid.Row>
          }
          { !current.brokerId && anthem &&
            <Grid.Row>
              <Grid.Column width="4">
                <div className="header3">Step 4 - BCC</div>
              </Grid.Column>
              <Grid.Column width="12">
                <Table className="data-table basic" unstackable>
                  <Table.Header>
                    <Table.Row className="data-table-head">
                      <Table.HeaderCell width="16">Include a BCC Email</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row className="data-table-body">
                      <Table.Cell width="16" verticalAlign="top">
                        <Grid>
                          <Grid.Row>
                            <Grid.Column width="8">
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
          <Grid.Row>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="4">
              <div className="header3">
                { (anthem) &&
                  (current.brokerId ? 'Step 3 - Approve or Deny' : 'Step 5 - Approve or Deny')
                }
                { (!anthem) &&
                  (current.brokerId ? 'Step 3 - Approve or Deny' : 'Step 4 - Approve or Deny')
                }
              </div>
            </Grid.Column>
            <Grid.Column width="6" />
            <Grid.Column width="3" style={{ paddingRight: 0 }}>
              { !loading && <Button disabled={!current.brokerId && (!editingCurrent.brokerSalesName || !editingCurrent.brokerPresaleName || (anthem && !bccEmail))} as={Link} to="/accounts/details/deny" fluid size="medium" color="grey" className="action-button" primary>Deny</Button> }
            </Grid.Column>
            <Grid.Column width="3" textAlign="center" className="button-cell">
              { !loading && <Button disabled={!current.brokerId && (!editingCurrent.brokerSalesName || !editingCurrent.brokerPresaleName || (anthem && !bccEmail))} fluid size="medium" className="action-button btn" primary onClick={approve}>Approve</Button> }
              <Loader indeterminate active={loading} size="medium" inline />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal
          className="account-details-edit"
          open={this.state.modalOpen}
          onClose={this.modalToggle}
          closeOnDimmerClick={false}
          size={'tiny'}
          closeIcon={<span className="close">X</span>}
        >
          <Grid>
            <Grid.Row className="header-main">
              <Grid.Column>
                <div>
                  <Header as="h2">Edit {(type === types.GA) ? 'GA' : 'BROKERAGE'} information</Header>
                </div>

              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="header-main">
              <Grid.Column>
                <Form>
                  <Form.Input label={`${type === 'GA' ? 'Company' : 'Brokerage'} Name`} value={editingCurrent[`${type}Name`]} name={`${type}Name`} onChange={this.onChangeInfoHandler} />
                  <Form.Input label="Address" value={editingCurrent[`${type}Address`]} name={`${type}Address`} onChange={this.onChangeInfoHandler} />
                  <Form.Group widths="equal">
                    <Form.Input label="City" value={editingCurrent[`${type}City`]} name={`${type}City`} onChange={this.onChangeInfoHandler} />
                    <Form.Dropdown label="State" search selection options={states} value={editingCurrent[`${type}State`]} name={`${type}State`} onChange={(e, inputState) => { this.onChangeInfoHandler({ target: { name: `${type}State` } }, inputState); }} />
                  </Form.Group>
                  <Form.Group>
                    <Form.Input width="8" label="Zip" value={editingCurrent[`${type}Zip`]} name={`${type}Zip`} onChange={this.onChangeInfoHandler} />
                  </Form.Group>
                  { this.state.type === 'GA' &&
                    <Form.Input label="Full Name" value={editingCurrent.agentName} name={'agentName'} onChange={this.onChangeInfoHandler} />
                  }
                  <Form.Input label="Email" value={editingCurrent[(type === types.GA) ? 'agentEmail' : 'brokerEmail']} name={(type === types.GA) ? 'agentEmail' : 'brokerEmail'} onChange={this.onChangeInfoHandler} />
                </Form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column width="6">
                <Button className="btn" fluid size="medium" color="grey" primary onClick={this.onCancelChangeInfo}>Cancel</Button>
              </Grid.Column>
              <Grid.Column width="6">
                <Button className="btn" fluid size="medium" primary onClick={this.onSaveInfo}>Save</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal>
      </div>
    );
  }
}

export default Details;
