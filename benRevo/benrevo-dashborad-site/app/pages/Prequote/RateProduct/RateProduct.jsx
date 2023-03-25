import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Header } from 'semantic-ui-react';
import * as types from '../constants';
import RateBank from './components/RateBank';
import HistoryRequest from './components/HistoryRequest';
import RateBankModal from './components/RateBankModal';
import PlansTable from './components/PlansTable';
import PlansBudget from './components/PlansBudget';
import Totals from './components/Totals';

class RateProduct extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    changeEditTable: PropTypes.func.isRequired, // action which change table-edit state
    isEdit: PropTypes.bool, // state of edit-table
    editTableInput: PropTypes.func.isRequired, // action when works 'OnChange' at tables input
    editedTableInputs: PropTypes.object.isRequired, // object, where writed all changed table inputs
    isBudgetEdit: PropTypes.bool, // state of edit-budget
    changeEditBudget: PropTypes.func.isRequired, // action who change budget-edit state
    editBudgetInput: PropTypes.func.isRequired, // action when works 'OnChange' at budgets input
    editedBudgetInputs: PropTypes.object.isRequired, // object, where writed all changed badget inputs
    saveTableData: PropTypes.func.isRequired, // action, wich load all edited inputs in table to server
    saveBudgetData: PropTypes.func.isRequired, // action, who load all edited inputs in budget to server
    sent: PropTypes.bool.isRequired,  // state of all page, which open modal window when all data sended to server
    section: PropTypes.string.isRequired, // string, which display title of page by route
    quoteType: PropTypes.string.isRequired, // string, which display quote-type of page by route
    title: PropTypes.string.isRequired, // string of title
    sending: PropTypes.bool.isRequired, // state which displays loader, when send-to-broker button pushed
    history: PropTypes.array.isRequired, // array of history loaded to broker data
    rateBank: PropTypes.object.isRequired, // all state of bank, received from the server
    sendToBank: PropTypes.func.isRequired, // action, which changed state when send-to-broker button pushed
    getRateBank: PropTypes.func.isRequired, // action of loading data to the table
    getHistoryBank: PropTypes.func.isRequired, // action of request history of loaded to the server data
    changeSentBank: PropTypes.func.isRequired, // action which change state, when data sended to broker
    tableUnmount: PropTypes.func.isRequired,  // action to unmount all data from the tables, when we leave the page
    client: PropTypes.object.isRequired,
  };
  state = {
    filesToUpload: [],
    note: '',
    editTableValue: {},
    editBudgetValue: {},
  }

  componentWillMount() {
    const { getRateBank, quoteType, changeSentBank, getHistoryBank } = this.props;
    getRateBank(quoteType);
    getHistoryBank(quoteType);
    changeSentBank(false);
  }

  componentWillUnmount() {
    const { changeEditBudget, changeEditTable, tableUnmount } = this.props;
    changeEditBudget(false);
    changeEditTable(false);
    tableUnmount({});
  }

  getSize(b) {
    const fsizekb = b / 1024;
    const fsizemb = fsizekb / 1024;
    const fsizegb = fsizemb / 1024;
    const fsizetb = fsizegb / 1024;
    let fsize;
    if (fsizekb <= 100) {
      fsize = `${fsizekb.toFixed(2)} KB`;
    } else if (fsizekb >= 100 && fsizemb <= 100) {
      fsize = `${fsizemb.toFixed(2)} MB`;
    } else if (fsizemb >= 100 && fsizegb < 1000) {
      fsize = `${fsizegb.toFixed(2)} GB`;
    } else {
      fsize = `${fsizetb.toFixed(2)} TB`;
    }
    return fsize;
  }

  render() {
    const {
      sent,
      title,
      section,
      sending,
      sendToBank,
      history,
      rateBank,
      changeEditTable,
      changeEditBudget,
      isEdit,
      isBudgetEdit,
      editTableInput,
      editBudgetInput,
      editedTableInputs,
      editedBudgetInputs,
      saveTableData,
      saveBudgetData,
      quoteType,
      client,
    } = this.props;
    return (
      <Card.Content className="prequoted-bank main-card">
        { !sent &&
          <Grid>
            <Grid.Row>
              <Grid.Column width={16} textAlign="center">
                <Header as="h1" className="title1">Request Rate Bank</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <div className="top-divider" />
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={16}>
                      <div className="header-border">Ratebank - {(section !== types.KAISER_SECTION) ? title : 'Medical w/Kaiser'}</div>
                      <PlansTable
                        rateBank={rateBank}
                        saveTableData={saveTableData}
                        quoteType={quoteType}
                        editTableInput={editTableInput}
                        editedTableInputs={editedTableInputs || Map({})}
                        isEdit={isEdit}
                        changeEditTable={changeEditTable}
                        client={client}
                        section={section}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={8}>
                      <div className="header-border">Budget Requests</div>
                      <PlansBudget
                        rateBank={rateBank}
                        saveBudgetData={saveBudgetData}
                        quoteType={quoteType}
                        editBudgetInput={editBudgetInput}
                        editedBudgetInputs={editedBudgetInputs}
                        isBudgetEdit={isBudgetEdit}
                        changeEditBudget={changeEditBudget}
                      />
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Totals rateBank={rateBank} />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className="total-line">
                    <Grid.Column width={10}>
                      Anthem Total {(section !== types.KAISER_SECTION) ? title : 'Medical w/Kaiser'} Premium
                    </Grid.Column>
                    <Grid.Column width={6} textAlign="right">
                      $
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={16}>
                      <Card fluid className="inner">
                        <Grid stackable>
                          <Grid.Row>
                            <Grid.Column width={16}>
                              <Header as="h4">Request Ratebank</Header>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={10}>
                              <RateBank
                                note={this.state.note}
                                changeNote={(e, inputState) => { this.setState({ note: inputState.value }); }}
                                onDropFiles={(files) => {
                                  this.setState(({ filesToUpload }) => {
                                    let allFiles = [...filesToUpload, ...files];
                                    if (allFiles.length > 5) { allFiles = allFiles.slice(1).slice(-5); }
                                    return ({ filesToUpload: allFiles, name: 'productZone' });
                                  });
                                }}
                                filesToUpload={this.state.filesToUpload}
                                updateFiles={(files) => this.setState({ filesToUpload: files })}
                                sending={sending}
                                sendToBank={sendToBank}
                                quoteType={quoteType}
                              />
                            </Grid.Column>
                            <Grid.Column width={6}>
                              <Grid>
                                <Grid.Row>
                                  <Grid.Column width={16}>
                                    <HistoryRequest history={history} types={types} />
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Card>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          }
        { sent && <RateBankModal /> }
      </Card.Content>
    );
  }
}

export default RateProduct;
