import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Modal, Grid } from 'semantic-ui-react';
import { extractFloat } from '@benrevo/benrevo-react-core';

class AlternativesMotion extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
    carrierName: PropTypes.string.isRequired,
    motionLink: PropTypes.string.isRequired,
    benefits: PropTypes.string.isRequired,
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

    this.setState({ modalOpen: close });
  }

  render() {
    const { value, carrierName, motionLink, data, benefits } = this.props;
    const getValue = (showValue) => <FormattedNumber
      style="currency" // eslint-disable-line react/style-prop-object
      currency="USD"
      minimumFractionDigits={0}
      maximumFractionDigits={2}
      value={showValue}
    />;
    const maxHeight = 105;
    let originalValue = 0;
    let discountValue = 0;
    let finalValue = 0;
    let percent = 0;
    let greenHeight = 0;
    let blueHeight = 0;
    if (benefits === 'in' && data.originalValueIn) {
      originalValue = extractFloat(data.originalValueIn.replace(/,/g, ''))[0];
      discountValue = parseFloat(data.discountValueIn);
    } else if (benefits === 'out' && data.originalValueOut) {
      originalValue = extractFloat(data.originalValueOut.replace(/,/g, ''))[0];
      discountValue = parseFloat(data.discountValueOut);
    } else {
      originalValue = extractFloat(data.originalValue.replace(/,/g, ''))[0];
      discountValue = parseFloat(data.discountValue);
    }

    finalValue = originalValue - discountValue;
    percent = (discountValue / originalValue) * 100;

    if (percent < 30) percent = 30;
    else if (percent > 70) percent = 70;

    greenHeight = (maxHeight / 100) * (100 - percent);
    blueHeight = maxHeight - greenHeight;
    return (
      <div className="motion-value">
        <div className="motion-value-link"><a tabIndex={0} onClick={this.modalToggle}>{value}</a></div>
        <a tabIndex={0} className="motion-icon" onClick={this.modalToggle}>{''}</a>
        <Modal
          className="modal-motion"
          open={this.state.modalOpen}
          onClose={this.modalToggle}
          closeOnDimmerClick
          size="small"
          closeIcon={<span className="close">X</span>}
        >
          <Modal.Content>
            <div className="modal-motion-header">
              Lower your deductible with Motion Funding
            </div>
            <Grid stackable>
              <Grid.Row centered className="modal-motion-funds">
                <Grid.Column textAlign="center" width="4">
                  <div className="motion-impact-title">Deductible</div>
                  <div className="motion-fund-item">
                    {getValue(originalValue)}
                  </div>
                </Grid.Column>
                <Grid.Column textAlign="center" width="5">
                  <span className="motion-fund-separator first">-</span>
                  <div className="motion-impact-title">Motion Fund Max</div>
                  <div className="motion-fund-item">
                    {getValue(discountValue)}
                  </div>
                </Grid.Column>
                <Grid.Column textAlign="center" width="4">
                  <span className="motion-fund-separator">=</span>
                  <div className="motion-impact-title">Net Deductible</div>
                  <div className="motion-fund-item">
                    {getValue(finalValue)}
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid>
              <Grid.Row centered className="modal-motion-divider">
                <Grid.Column width="5" />
                <Grid.Column width="4" textAlign="center"> SEE THE IMPACT </Grid.Column>
                <Grid.Column width="5" />
              </Grid.Row>
            </Grid>
            <Grid stackable>
              <Grid.Row centered className="modal-motion-impact">
                <Grid.Column textAlign="center" width="4">
                  <div className="motion-impact-title">Standard Plan</div>
                  <div className="motion-standard line" style={{ height: maxHeight }}>
                    <div className="motion-impact-item-inner">
                      <div>Deductible</div>
                      {getValue(originalValue)}
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column textAlign="center" width="5">
                  <div className="motion-impact-title center">
                    Motion HRA Funding<br />
                    reduces your deductible
                  </div>
                  <div className="motion-impact-item" style={{ height: blueHeight }} />
                  <div className="motion-standard line" style={{ height: greenHeight }}>
                    <div className="motion-impact-item-inner">
                      <div>Net Deductible</div>
                      {getValue(finalValue)}
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column textAlign="center" width="4" verticalAlign="bottom">
                  <div className="motion-impact-title">
                    w/Motion Fund
                  </div>
                  <div className="motion-standard" style={{ height: greenHeight }}>
                    <div className="motion-impact-item-inner">
                      <div>Net Deductible</div>
                      {getValue(finalValue)}
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div className="modal-motion-footer">
              <span className="motion-icon" />
              {carrierName} Motion <a target="_tab" href={motionLink}>Learn More</a>
            </div>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default AlternativesMotion;
