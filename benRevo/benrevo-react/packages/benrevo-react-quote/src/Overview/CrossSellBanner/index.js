/*
 *
 * MedicalOverview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import { CrossSellBannerImg } from '@benrevo/benrevo-react-core';

import {
  Banner,
  Heavy,
  SaveImage,
} from './componentStyles';

export class CrossSellBanner extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    totalAnnualPremium: PropTypes.number,
  };

  render() {
    const { totalAnnualPremium } = this.props;
    return (
      <Grid centered className="bottomOverview">
        <Grid.Column width={16}>
          <Banner>
            <SaveImage>
              <Image src={CrossSellBannerImg} />
            </SaveImage>
            Want to <Heavy>
            save an additional <FormattedNumber
              style="currency" // eslint-disable-line react/style-prop-object
              currency="USD"
              minimumFractionDigits={0}
              maximumFractionDigits={2}
              value={totalAnnualPremium}
            /></Heavy> a year off your medical bill? Add employer-sponsored dental and vision to your medical quote.
          </Banner>
        </Grid.Column>
      </Grid>
    );
  }
}

export default CrossSellBanner;
