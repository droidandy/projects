/**
*
* RiderCard
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Loader, Card, Dropdown } from 'semantic-ui-react';
import CarrierLogo from './../../../CarrierLogo';

export class RiderCard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.selectRider = this.selectRider.bind(this);
  }

  selectRider(active, riderId) {
    const { section, rider, optionRiderSelect, optionRiderUnSelect, optionId } = this.props;

    if (active) optionRiderUnSelect(section, riderId, rider.rfpQuoteOptionNetworkId, optionId);
    else {
      if (!this.props.multiRider) {
        for (let i = 0; i < rider.riders.length; i += 1) {
          const item = rider.riders[i];
          if (item.selected) {
            optionRiderUnSelect(section, item.riderId, rider.rfpQuoteOptionNetworkId, optionId);
          }
        }
      }

      optionRiderSelect(section, riderId, rider.rfpQuoteOptionNetworkId, optionId);
    }
  }

  render() {
    const { section, rider, riderFees, saveRiderFee, optionId } = this.props;
    let showSelectColumn = false;
    const SelectButton = ({ active, riderId }) =>
      <Button toggle active={active} size="medium" onClick={() => { this.selectRider(active, riderId); }} className="selected-button">
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
    let options = [];

    if (rider.networkType === 'HSA' && riderFees) {
      options = riderFees.map((item) => ({
        key: item.administrativeFeeId,
        value: item.administrativeFeeId,
        text: item.name,
      }));
    }

    for (let i = 0; i < rider.riders.length; i += 1) {
      const item = rider.riders[i];

      if (item.selectable) {
        showSelectColumn = true;
        break;
      }
    }

    return (
      <Card className="card-contributions-container">
        <Grid verticalAlign="middle">
          <Grid.Row className="card-top" verticalAlign="middle">
            <Grid.Column width={3} className="contribution-card-logo">
              <CarrierLogo carrier={rider.carrier} section={this.props.section} />
            </Grid.Column>
            <Grid.Column width={11}>
              <div className="plan-name">{rider.planNameByNetwork}</div>
            </Grid.Column>
            <Grid.Column width={2} textAlign="center">
              <Loader inline active={this.props.loading} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Column width={16}>
            <div className="card-contributions-component">
              <Grid textAlign="left" columns="equal">
                <Grid.Row className="card-contributions-row" verticalAlign="middle">
                  <Grid.Column width={5}>Rider</Grid.Column>
                  <Grid.Column width={4}>Details</Grid.Column>
                  {showSelectColumn && <Grid.Column width={3}>Choose an option</Grid.Column> }
                </Grid.Row>
              </Grid>
            </div>
            <div className="card-contributions-component">
              <Grid textAlign="left" columns="equal">
                {rider.riders.map((item, i) =>
                  <Grid.Row className={(rider.selectable) ? 'card-contributions-row card-rider-row-selectable' : 'card-contributions-row'} verticalAlign="middle" key={i}>
                    <Grid.Column width={5}>{item.riderCode}</Grid.Column>
                    <Grid.Column width={4}>{item.riderDescription}</Grid.Column>
                    {item.selectable &&
                      <Grid.Column width={7}>
                        <SelectButton active={item.selected} riderId={item.riderId} />
                      </Grid.Column>
                    }
                  </Grid.Row>
                )}
                {!rider.selectable && !rider.administrativeFee &&
                  <Grid.Row>
                  </Grid.Row>
                }
                {rider.selectable &&
                <Grid.Row className={(rider.administrativeFee) ? 'card-contributions-row card-rider-row-selectable' : 'card-contributions-row card-rider-row-selectable card-rider-none'} verticalAlign="middle">
                  <Grid.Column width={5}>None</Grid.Column>
                  <Grid.Column width={4}>-</Grid.Column>
                  <Grid.Column width={7}>
                    <SelectButton active />
                  </Grid.Column>
                </Grid.Row>
                }

                {options.length > 0 &&
                  <Grid.Row className="card-contributions-row card-rider-bottom">
                    <Grid.Column width={16}>Select an H.S.A administrator (fees will be included in the groups total rates)</Grid.Column>
                    <Grid.Column width={7}>
                      <Dropdown selection className="select-fee" value={rider.administrativeFeeId} fluid options={options} placeholder="Select administartive fee" onChange={(e, inputState) => { saveRiderFee(section, inputState.value, rider.rfpQuoteOptionNetworkId, optionId); }} />
                    </Grid.Column>
                  </Grid.Row>
                }
              </Grid>
            </div>
          </Grid.Column>
        </Grid>
      </Card>
    );
  }
}

RiderCard.propTypes = {
  loading: PropTypes.bool,
  multiRider: PropTypes.bool,
  section: PropTypes.string,
  optionId: PropTypes.number,
 // index: PropTypes.number,
  rider: PropTypes.object,
  riderFees: PropTypes.array,
  saveRiderFee: PropTypes.func,
  optionRiderSelect: PropTypes.func,
  optionRiderUnSelect: PropTypes.func,
};

export default RiderCard;
