import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Table, List, Image, Loader } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import { getColor } from './../../../../utils/getColor';
import { getLogo, getClass } from '../utils';
import { CARRIER } from '../../../../config';

class OptionDetails extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    getOption: PropTypes.func.isRequired,
    optionDetails: PropTypes.object,
    optionRiders: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };
    this.modalToggle = this.modalToggle.bind(this);
  }

  modalToggle() {
    const close = !this.state.modalOpen;

    if (close) {
      this.props.getOption(this.props.id);
    }

    this.setState({ modalOpen: close });
  }

  render() {
    const { optionRiders, optionDetails } = this.props;
    let riders = false;
    const loading = true;
    return (
      <div>
        <a tabIndex={0} onClick={this.modalToggle}>View Details</a>
        <Modal
          className="modal-option"
          open={this.state.modalOpen}
          onClose={this.modalToggle}
          closeOnDimmerClick
          closeIcon={<span className="close">X</span>}
        >
          <Modal.Content>
            <div className="option-card details-card">
              <div className={`${getClass(optionRiders.carrier, optionDetails.quoteType)} carrier-logo`}>
                <Image src={getLogo(optionRiders.carrier, optionDetails.quoteType)} />
              </div>
              <div className="modal-header">
                <span className="option-name">Option 1</span>
                <span className="option-carrier">Details</span>
              </div>
              { Object.keys(optionDetails).length > 0 &&
                <Grid className="option-info option-details">
                  <Grid.Row>
                    <Grid.Column mobile={8} tablet={4} computer={4}>
                      <div className="option-info-title">TOTAL ANNUAL PREMIUM</div>
                      <div className="premium">
                        { optionDetails.totalAnnualPremium &&
                        <FormattedNumber
                          style="currency" // eslint-disable-line react/style-prop-object
                          currency="USD"
                          minimumFractionDigits={2}
                          maximumFractionDigits={2}
                          value={optionDetails.totalAnnualPremium}
                        />
                        }
                      </div>
                    </Grid.Column>
                    <Grid.Column mobile={8} tablet={4} computer={4} textAlign="center">
                      <div className="option-info-title">% DIFFERENCE</div>
                      <div
                        className="option-difference"
                        style={{ backgroundColor: getColor(optionDetails.percentDifference) }}
                      >
                        {(optionDetails.percentDifference > 0) ? '+' : ''}{optionDetails.percentDifference}
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column tablet={16} computer={16}>
                      <div className="option-info-title">PLANS</div>
                      <Table celled className="full-celled">
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>Type</Table.Cell>
                            <Table.Cell>Plan Names</Table.Cell>
                            <Table.Cell>$DIFF/Mo.</Table.Cell>
                            <Table.Cell>% DIFF</Table.Cell>
                          </Table.Row>
                          { optionDetails.detailedPlans && optionDetails.detailedPlans.map((item, key) =>
                            <Table.Row key={key}>
                              <Table.Cell>{item.type}</Table.Cell>
                              <Table.Cell>{(item.newPlan) ? item.newPlan.name : ''}</Table.Cell>
                              <Table.Cell>
                                <FormattedNumber
                                  style="currency" // eslint-disable-line react/style-prop-object
                                  currency="USD"
                                  minimumFractionDigits={0}
                                  maximumFractionDigits={0}
                                  value={item.dollarDifference || 0}
                                />
                              </Table.Cell>
                              <Table.Cell>
                                <FormattedNumber
                                  style="percent" // eslint-disable-line react/style-prop-object
                                  minimumFractionDigits={0}
                                  maximumFractionDigits={1}
                                  value={(item.percentDifference) ? item.percentDifference / 100 : 0}
                                />
                              </Table.Cell>
                            </Table.Row>
                          )}
                        </Table.Body>
                      </Table>
                    </Grid.Column>
                  </Grid.Row>
                  {(optionRiders.networkRidersDtos && optionRiders.networkRidersDtos.length > 0) &&
                  <Grid.Row>
                    <Grid.Column tablet={16} computer={16}>
                      <div className="option-info-title">RIDERS</div>
                      <List>
                        { optionRiders.networkRidersDtos.map((ntRider, i) =>
                          ntRider.riders.map((rider, j) => {
                            if (rider.selected || CARRIER === 'UHC') {
                              riders = true;
                              return (
                                <List.Item className="rider" key={i + j}>{rider.riderCode}</List.Item>
                              );
                            }
                            return null;
                          })
                        )}
                        { !riders && <List.Item className="rider">-</List.Item> }
                      </List>
                    </Grid.Column>
                  </Grid.Row>
                  }
                </Grid>
              }
              { !Object.keys(optionDetails).length && <Loader inline indeterminate active={loading} size="big">Fetching details</Loader> }
            </div>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default OptionDetails;
