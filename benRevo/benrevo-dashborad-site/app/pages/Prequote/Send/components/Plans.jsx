import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router';

class Send extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    data: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    section: PropTypes.string.isRequired,
  };

  render() {
    const {
      data,
      client,
      section,
    } = this.props;
    const isEmpty = !Object.keys(data).length;
    return (
      <div>
        <Table className="stripped" unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={6}>Network</Table.HeaderCell>
              <Table.HeaderCell width={1} textAlign="right">ENROLL</Table.HeaderCell>
              <Table.HeaderCell width={2} textAlign="right">%DIFF <br /> CURRENT</Table.HeaderCell>
              <Table.HeaderCell width={2} textAlign="right">$DIFF <br /> CURRENT</Table.HeaderCell>
              <Table.HeaderCell width={2} textAlign="right">%DIFF <br /> RENEWAL</Table.HeaderCell>
              <Table.HeaderCell width={2} textAlign="right">$DIFF <br /> RENEWAL</Table.HeaderCell>
              <Table.HeaderCell width={1} textAlign="right" />
            </Table.Row>
          </Table.Header>
          { !isEmpty &&
            <Table.Body>
              { data.plans && data.plans.map((item, i) => {
                if (item.planName) {
                  return (
                    <Table.Row key={i}>
                      <Table.Cell className="plan-info">
                        <div className="plan-title">{item.planType} - {item.networkName}</div>
                        <div>{item.planName}</div>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <div>{item.enrollment}</div>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <div>{item.percentDifference}%</div>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <div>${item.dollarDifference}</div>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <div>{item.renewalPercentDifference}%</div>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <div>${item.renewalDollarDifference}</div>
                      </Table.Cell>
                      <Table.Cell textAlign="right" />
                    </Table.Row>
                  );
                }
                return null;
              })}
              <Table.Row className="subtotal">
                <Table.Cell>
                  <div>Subtotal</div>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <div>{data.enrollment}</div>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <div>-</div>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <div>${data.totalDollarDifference}</div>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <div>-</div>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <div>${data.totalRenewalDollarDifference}</div>
                </Table.Cell>
                <Table.Cell textAlign="right" />
              </Table.Row>
            </Table.Body>
          }
        </Table>
        { isEmpty &&
        <div className="empty-quote">You need to <Link to={`/prequote/clients/${client.id}/quote`}>upload quotes</Link> and <Link to={`/prequote/clients/${client.id}/match/${section}`}>select plans</Link>.</div>
        }
      </div>
    );
  }
}

export default Send;
