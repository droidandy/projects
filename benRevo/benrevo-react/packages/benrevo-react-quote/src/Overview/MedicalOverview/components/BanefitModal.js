/**
 *
 * Benefit modal content
 *
 * On the Medical Overview page, there is a button that says "2 year rate cap".
 * That modal should be hooked up to show the same data as the http://dev-benrevo-env.elasticbeanstalk.com/standalone/medical-overview-static.html page.

 1)  The API will return:
 - The yearly cost of the current plan.
 - The yearly cost of the new plan (Anthem).

 2)  The scale of the numbers across the bottom should go from 0 to the higher cost of the two plans.,
 rounded up to the nearest million.  For example, if the plans are 1,200,000 and 2,300,000, then the numbers at the bottom should go to 3M.
 Another example:  If the plans are 8,120,000 and 5,900,000, then the numbers at the bottom should go to 9M.

 3)  The bars' width represent the cost of the plans.  The current plan bar should show the year one-cost, then 12% of the year-one cost,
 then the year-two cost (which is the same as year-one).
 The new plan should show the year-one cost, then 9% of the year-one cost, then the year-two cost (which is the same as year-one).

 4)  The total cost of the two plans (year-one, plus the percentage, plus year-two) should be shown to the right of each plan.

 5) The total difference (current plan cost minus new plan cost) should be shown in the black box at the bottom.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, Dimmer, Loader } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import { PopBtmLineImage } from '@benrevo/benrevo-react-core';

class BenefitModal extends React.Component {
  static propTypes = {
    yearlyCPCost: PropTypes.number.isRequired,
    yearlyAPCost: PropTypes.number.isRequired,
    carrierAP: PropTypes.string.isRequired,
    carrierName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.state = {
      maxScale: 2,
      yearlyCPCost: 0,
      yearlyCPWidth: 0,
      yearlyAPCost: 0,
      yearlyAPWidth: 0,
      costScale: [],
      bottom: [],
      bottomColumn: '25%',
      columnWidth: '25%',
      wrapWidth: '65%',
    };
    this.loading = true;
  }

  componentDidMount() {
    const { yearlyCPCost, yearlyAPCost } = this.props;
    const cPCost = (yearlyCPCost * 1.12) + yearlyCPCost;
    const aPCost = (yearlyAPCost * 1.099) + yearlyAPCost;

    this.calculateScale(cPCost, aPCost);
  }

  calculateScale(curCost, altCost) {
    const yearlyCPCost = curCost;
    const yearlyAPCost = altCost;
    const max = Math.max(curCost, altCost);
    const maxScale = Math.ceil(max / 1000000) * 1000000;
    const costScale = [];
    this.setState({ yearlyCPCost, yearlyAPCost, maxScale });
    // calculating step width
    for (let i = 0; i < (maxScale / 1000000); i += 1) {
      const index = i + 1;

      costScale.push(index);
    }

    const featureWidth = 100 / (costScale.length + 1);
    const columnWidth = `${featureWidth}%`;
    // 65% - full width of yearly row

    const yearlyAPWidth = `${featureWidth * (altCost / 1000000) * 0.65}%`;
    const yearlyCPWidth = `${featureWidth * (curCost / 1000000) * 0.65}%`;

    this.setState({ costScale, columnWidth, yearlyAPWidth, yearlyCPWidth });
  }

  render() {
    const { yearlyCPCost, yearlyAPCost, costScale, columnWidth, yearlyCPWidth, yearlyAPWidth } = this.state;
    if (costScale && costScale.length > 0) {
      return (
        <div className="benefit-modal-content">
          <div className="aetna">
            <div className="aetnatxt">{this.props.carrierAP}</div>
            <div className="aetnabox" style={{ width: yearlyCPWidth }}>
              <div className="firstYrbox">1st Year</div>
              <div className="opsoltmain">
                <div className="opsoltmainbg">
                  <div className="opsolt">+12%</div>
                </div>
              </div>
              <div className="scndyr">2nd Year</div>
            </div>
            <div className="conttxt">
              <FormattedNumber
                style="currency" // eslint-disable-line react/style-prop-object
                currency="USD"
                minimumFractionDigits={0}
                maximumFractionDigits={0}
                value={yearlyCPCost}
              />
            </div>
          </div>
          <div className="aetna">
            <div className="aetnatxt1">{this.props.carrierName}</div>
            <div className="aetnabox1" style={{ width: yearlyAPWidth }}>
              <div className="firstYrbox1">1st Year</div>
              <div className="opsoltmain1">
                <div className="opsoltmainbg">
                  <div className="opsolt1">+9.9%<span>*</span></div>
                </div>
              </div>
              <div className="scndyr1">2nd Year</div>
            </div>
            <div className="conttxt1">
              <FormattedNumber
                style="currency" // eslint-disable-line react/style-prop-object
                currency="USD"
                minimumFractionDigits={0}
                maximumFractionDigits={0}
                value={yearlyAPCost}
              />
            </div>
          </div>
          <div className="estimated">
            <p>Estimated{' '}
              <FormattedNumber
                style="currency" // eslint-disable-line react/style-prop-object
                currency="USD"
                minimumFractionDigits={0}
                maximumFractionDigits={0}
                value={yearlyCPCost - yearlyAPCost}
              />
              {' '}premium savings over 2 years</p>
          </div>
          <div className="btmdiv">
            <div className="btmdivcost" style={{ width: columnWidth }}><Image src={PopBtmLineImage} />COST</div>
            { costScale.map((item, j) =>
              <div className="btmdivcost" style={{ width: columnWidth }} key={j}>
                <Image src={PopBtmLineImage} />{item}M
              </div>
            )}
          </div>
          <div className="star">
            * See Riders/Disclosures for additional information
          </div>
        </div>
      );
    }
    return (
      <Dimmer active={this.loading} inverted>
        <Loader indeterminate size="big">Getting plans data</Loader>
      </Dimmer>
    );
  }
}

export default BenefitModal;
