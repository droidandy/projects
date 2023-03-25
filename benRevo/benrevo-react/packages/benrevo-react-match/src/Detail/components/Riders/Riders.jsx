import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Grid } from 'semantic-ui-react';
import CarrierLogo from './../../../components/CarrierLogo';

class Riders extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    page: PropTypes.object.isRequired,
    quoteType: PropTypes.string.isRequired,
    detailedPlan: PropTypes.object.isRequired,
    openedOption: PropTypes.object.isRequired,
    optionRiderSelect: PropTypes.func.isRequired,
    optionRiderUnSelect: PropTypes.func.isRequired,
    rider: PropTypes.object,
    multiRider: PropTypes.bool,
  };

  static defaultProps = {
    rider: null,
    multiRider: false,
  };

  constructor(props) {
    super(props);
    this.selectRider = this.selectRider.bind(this);
  }

  selectRider(active, item, rider) {
    const {
      section,
      optionRiderSelect,
      optionRiderUnSelect,
      openedOption,
      multiRider,
    } = this.props;
    if (active) optionRiderUnSelect(section, item.riderId, rider.rfpQuoteOptionNetworkId, openedOption.id);
    else {
      if (!multiRider) {
        if (item.selected) {
          optionRiderUnSelect(section, item.riderId, rider.rfpQuoteOptionNetworkId, openedOption.id);
        }
      }

      optionRiderSelect(section, item.riderId, rider.rfpQuoteOptionNetworkId, openedOption.id);
    }
  }

  render() {
    const { section, page, quoteType, rider, detailedPlan } = this.props;
    // console.log('rider props', this.props);
    let riders = [];
    let ntRider = null;
    if (rider && rider.networkRidersDtos && rider.networkRidersDtos.length > 0) {
      rider.networkRidersDtos.forEach((networkRider) => {
        if (networkRider.rfpQuoteOptionNetworkId === detailedPlan.rfpQuoteOptionNetworkId && networkRider.riders && networkRider.riders.length) {
          riders = networkRider.riders;
          ntRider = networkRider;
        }
      });
    }
    const SelectButton = ({ active, item, riderItem }) =>
      <Button toggle primary active={active} size="medium" onClick={() => { this.selectRider(active, item, riderItem); }} className="selected-button">
        { !active &&
        <div>
          Select
        </div>
        }
        { active &&
        <div>
          <span>Selected</span>
        </div>
        }
      </Button>;
    if (riders.length > 0) {
      return (
        <Grid className="riders">
          <div className="divider"></div>
          <Grid.Row className="riders-row">
            <Grid.Column className="riders-left">
              <header>Riders</header>
            </Grid.Column>
            <Grid.Column className="riders-right">
              <div className="riders-block">
                <div className="logo-block">
                  { (page.carrier && page.carrier.carrier) &&
                  <CarrierLogo carrier={page.carrier.carrier.displayName} section={section} quoteType={quoteType} />
                  }
                </div>
                <Table className="all-plans-table">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={3}>RIDER</Table.HeaderCell>
                      <Table.HeaderCell width={6}>DETAIL</Table.HeaderCell>
                      <Table.HeaderCell width={5}>COST</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Action</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { riders.map((item) =>
                      <Table.Row className="all-plans-body-row">
                        <Table.Cell>{item.riderCode}</Table.Cell>
                        <Table.Cell>{item.riderDescription}</Table.Cell>
                        <Table.Cell>
                          <p>Tier 1 Rate - {item.tier1Rate}</p>
                          <p>Tier 2 Rate - {item.tier2Rate}</p>
                          <p>Tier 3 Rate - {item.tier3Rate}</p>
                          <p>Tier 4 Rate - {item.tier4Rate}</p>
                        </Table.Cell>
                        <Table.Cell className="action-cell">
                          {item.selectable &&
                          <SelectButton active={item.selected} item={item} riderItem={ntRider} />
                          }
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return (
      <div className="riders"></div>
    );
  }
}

export default Riders;
