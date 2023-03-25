import { Button, Table, Input } from 'semantic-ui-react';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import NumberFormat from 'react-number-format';

class PlansTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    rateBank: PropTypes.object.isRequired,
    saveTableData: PropTypes.func.isRequired,
    quoteType: PropTypes.string.isRequired,
    editTableInput: PropTypes.func.isRequired,
    editedTableInputs: PropTypes.object.isRequired,
    isEdit: PropTypes.bool,
    changeEditTable: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    section: PropTypes.string.isRequired,
  }

  onTableInputChangeHandler = (e, item) => {
    const { editTableInput } = this.props;
    const value = e.target.value.replace('%', '').trim() || 0;
    editTableInput(item, value.toString());
  }
  render() {
    const {
        saveTableData,
        changeEditTable,
        quoteType,
        editedTableInputs,
        rateBank,
        isEdit,
        client,
        section,
      } = this.props;
    const isEmpty = !rateBank || !rateBank.plans || !rateBank.plans.length;
    return (
      <Table className={`stripped ${isEdit ? 'edit' : ''}`} unstackable>
        <Table.Header>
          <Table.Row>
            <Table.Cell className="rate-bank__preheader" colSpan={7}>
              <div className="preheader__line firstLine"></div>
              <p className="preheader__text">MONTHLY DIFFERENCES</p>
              <div className="preheader__line secondLine"></div>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell width={5}>Network</Table.HeaderCell>
            <Table.HeaderCell width={1} textAlign="right">ENROLL</Table.HeaderCell>
            <Table.HeaderCell width={2} textAlign="right">%vs.<br /> CURRENT</Table.HeaderCell>
            <Table.HeaderCell width={2} textAlign="right">$vs.<br /> CURRENT</Table.HeaderCell>
            <Table.HeaderCell width={2} textAlign="right">%vs.<br /> RENEWAL</Table.HeaderCell>
            <Table.HeaderCell width={2} textAlign="right">$vs.<br /> RENEWAL</Table.HeaderCell>
            <Table.HeaderCell width={2} textAlign="right">RATE BANK</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        { !isEmpty &&
        <Table.Body>
          <Table.Row>
            <Table.Cell className="edit-rate-button__area" colSpan={7} textAlign="right">
              {!isEdit && <Button className="rate-bank__editButton" primary floated={'right'} onClick={() => { changeEditTable(true); }} size="medium">Add/Edit Ratebank</Button>}
              { isEdit && <Link className="rate-bank__editLink" onClick={() => { changeEditTable(false); }}>Enter Rate Bank % Here <i className="share icon"></i></Link>}
            </Table.Cell>
          </Table.Row>
          {rateBank.plans && rateBank.plans.map((item, i) => {
            if (item.planName) {
              return (
                <Table.Row key={i}>
                  <Table.Cell className="plan-info">
                    <div className="plan-title">{item.planType} - {item.networkName}</div>
                    <div className="plan-names">{item.planName}</div>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <div>{item.enrollment}</div>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <div className={`${item.networkRateBank > 0 ? 'rate-bank-true' : ''}`}>{item.percentDifference}%</div>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <div className={`${item.networkRateBank > 0 ? 'rate-bank-true' : ''}`}>${item.dollarDifference}</div>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <div className={`${item.networkRateBank > 0 ? 'rate-bank-true' : ''}`}>{item.renewalPercentDifference}%</div>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <div className={`${item.networkRateBank > 0 ? 'rate-bank-true' : ''}`}>${item.renewalDollarDifference}</div>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    { !isEdit ?
                      <div className={`${item.networkRateBank > 0 ? 'rate-bank-true' : ''}`}>{item.networkRateBank || '-'}</div> :
                      <NumberFormat
                        className="rate-bank__input right aligned"
                        customInput={Input}
                        allowNegative={false}
                        suffix={'%'}
                        placeholder="%"
                        name={i}
                        value={editedTableInputs.get(i) || item.networkRateBank || ''}
                        onChange={(e) => this.onTableInputChangeHandler(e, i)}
                      />}
                  </Table.Cell>
                </Table.Row>
              );
            }
            return null;
          })}
          { isEdit &&
            <Table.Row>
              <Table.Cell className="edit-rate-button__area" colSpan={7} >
                <Button
                  className="rate-bank__editButton ui grey button"
                  floated={'left'}
                  onClick={() => { changeEditTable(false); }}
                  size="medium"
                >Cancel</Button>
                <Button
                  type="submit"
                  className="rate-bank__editButton ui blue button"
                  floated={'right'}
                  onClick={() => {
                    saveTableData({ data: editedTableInputs.toJS(), quoteType });
                    changeEditTable(false);
                  }}
                  size="medium"
                >Save Changes</Button>
              </Table.Cell>
            </Table.Row>
          }
        </Table.Body>}
        { isEmpty &&
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan="16" className="empty-quote" textAlign="center" >You need to
                <Link to={`/prequote/clients/${client.id}/quote`}>upload quotes</Link> and <Link to={`/prequote/clients/${client.id}/match/${section}`}>select plans</Link>.
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          }
      </Table>

    );
  }
}

export default PlansTable;
