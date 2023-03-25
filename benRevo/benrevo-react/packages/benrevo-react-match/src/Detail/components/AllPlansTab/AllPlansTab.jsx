import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Table, Loader } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import {
  arrowDown,
  warningIcon,
} from '@benrevo/benrevo-react-core';
import WarningCard from './../../../components/WarningCard';
import PlanNameDropdown from './../PlanNameDropdown';

class AllPlansTab extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired,
    openedOption: PropTypes.object.isRequired,
    contributions: PropTypes.array.isRequired,
    getAlternativePlansForDropdown: PropTypes.func.isRequired,
    plansForDropDown: PropTypes.object.isRequired,
    plansForDropDownLoading: PropTypes.bool,
    violationStatus: PropTypes.bool,
  };

  static defaultProps = {
    violationStatus: false,
    plansForDropDownLoading: false,
  };

  constructor(props) {
    super(props);
    this.getAlternativePlansForDropdown = this.getAlternativePlansForDropdown.bind(this);
  }

  componentWillMount() {
    this.getAlternativePlansForDropdown();
  }

  getAlternativePlansForDropdown() {
    const { getAlternativePlansForDropdown, section } = this.props;
    getAlternativePlansForDropdown(section);
  }

  render() {
    const {
      client,
      openedOption,
      section,
      contributions,
      plansForDropDown,
      plansForDropDownLoading,
      violationStatus,
    } = this.props;
    const detailedPlans = (openedOption && openedOption.detailedPlans && openedOption.detailedPlans.length) ? openedOption.detailedPlans : [];
    // console.log('allPlansTab.props', this.props);
    return (
      <Grid className="all-plans-tab">
        <Grid.Row className="header-row">
          <Grid.Column width={4} className="employees-count">
            <span>Employees Enrolled: <strong>{client.employeeCount}</strong></span><Image src={arrowDown} />
          </Grid.Column>
          <div className="divider" />
        </Grid.Row>
        <Grid.Row className="body-row">
          { violationStatus &&
          <Grid.Column width={10}>
            <WarningCard section={section} />
          </Grid.Column>
          }
          <Grid.Column width={15}>
            { !plansForDropDownLoading &&
            <Table className="all-plans-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Plan Type</Table.HeaderCell>
                  <Table.HeaderCell>Current</Table.HeaderCell>
                  <Table.HeaderCell>Network</Table.HeaderCell>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Plan Name</Table.HeaderCell>
                  <Table.HeaderCell>% Diff</Table.HeaderCell>
                  <Table.HeaderCell>ENROLL</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {detailedPlans.map((plan, key) => {
                  return (
                    <Table.Row key={key} className="all-plans-body-row">
                      <Table.Cell>{plan.type}</Table.Cell>
                      <Table.Cell>
                        {plan.currentPlan ? plan.currentPlan.name : ''}
                        <p>({(plan.currentPlan && plan.currentPlan.type) ? plan.currentPlan.type : '-'})</p>
                      </Table.Cell>
                      <Table.Cell>{plan.networkName}</Table.Cell>
                      <Table.Cell>
                        { violationStatus &&
                        <Image src={warningIcon} alt="warning" />
                        }
                      </Table.Cell>
                      <Table.Cell>
                        { plansForDropDown[plan.rfpQuoteNetworkId] &&
                        <PlanNameDropdown
                          planIndex={key}
                          alternativePlans={plansForDropDown[plan.rfpQuoteNetworkId]}
                          rfpQuoteOptionNetworkId={plan.rfpQuoteOptionNetworkId}
                          rfpQuoteNetworkPlanId={plan.rfpQuoteNetworkPlanId}
                          section={section}
                        />
                        }
                        { !plansForDropDown[plan.rfpQuoteNetworkId] &&
                          <span>-</span>
                        }
                      </Table.Cell>
                      <Table.Cell>
                        <FormattedNumber
                          style="percent" // eslint-disable-line react/style-prop-object
                          minimumFractionDigits={0}
                          maximumFractionDigits={1}
                          value={plan.percentDifference / 100 || 0}
                        /></Table.Cell>
                      <Table.Cell>{contributions[key] ? contributions[key].proposedEnrollmentTotal : ''}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            }
            { plansForDropDownLoading &&
            <Grid.Row className="alternatives-container centered">
              <Loader inline active={plansForDropDownLoading} indeterminate size="big">Loading plans</Loader>
            </Grid.Row>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default AllPlansTab;
