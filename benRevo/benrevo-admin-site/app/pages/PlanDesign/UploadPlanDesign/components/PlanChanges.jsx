import React from 'react';
import PropTypes from 'prop-types';
import { Table, Header, Icon } from 'semantic-ui-react';

class PlanChanges extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    changes: PropTypes.object.isRequired,
  };

  render() {
    const { changes } = this.props;
    return (
      <div className="plan-design-changes-tables">
        { changes.added.length > 0 &&
          <div>
            <Header as="h2" className="add-header">Added</Header>
            <Table unstackable className="data-table">
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="5">Network Name</Table.HeaderCell>
                  <Table.HeaderCell width="5">Plan Name</Table.HeaderCell>
                  <Table.HeaderCell width="5">Plan Type</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { changes.added.map((plan, index) => (
                  <Table.Row key={`added${index}`} className="data-table-body" positive>
                    <Table.Cell width="5">{plan.networkName}</Table.Cell>
                    <Table.Cell width="5">{plan.planName}</Table.Cell>
                    <Table.Cell width="5">{plan.planType}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        }

        { changes.updated.length > 0 &&
          <div>
            <Header as="h2" className="update-header">Updated</Header>
            <Table unstackable className="data-table">
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="3">Network Name</Table.HeaderCell>
                  <Table.HeaderCell width="3">Plan Name</Table.HeaderCell>
                  <Table.HeaderCell width="3">Plan Type</Table.HeaderCell>
                  <Table.HeaderCell width="7">Changed Benefits</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { changes.updated.map((plan, index) => (
                  <Table.Row key={`updated${index}`} className="data-table-body" warning>
                    <Table.Cell width="3">{plan.networkName}</Table.Cell>
                    <Table.Cell width="3">{plan.planName}</Table.Cell>
                    <Table.Cell width="3">{plan.planType}</Table.Cell>
                    <Table.Cell width="7">
                      { plan.changedBenefits.map((changed, i) => (
                        <p key={`updated${index}change${i}`}>
                          {changed.name}:
                          <span className="change-data-display">
                            {changed.oldValue} <Icon name="arrow right" /><b>{changed.newValue}</b>
                          </span>
                        </p>
                      ))}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        }
        { changes.removed.length > 0 &&
          <div>
            <Header as="h2" className="delete-header">Removed</Header>
            <Table unstackable className="data-table">
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="5">Network Name</Table.HeaderCell>
                  <Table.HeaderCell width="5">Plan Name</Table.HeaderCell>
                  <Table.HeaderCell width="5">Plan Type</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { changes.removed.map((plan, index) => (
                  <Table.Row key={`removed${index}`} className="data-table-body" negative>
                    <Table.Cell width="5">{plan.networkName}</Table.Cell>
                    <Table.Cell width="5">{plan.planName}</Table.Cell>
                    <Table.Cell width="5">{plan.planType}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        }
      </div>
    );
  }
}

export default PlanChanges;
