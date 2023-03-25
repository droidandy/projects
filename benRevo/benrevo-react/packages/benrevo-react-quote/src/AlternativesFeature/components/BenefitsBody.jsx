import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import ItemValueTypedBenefits from './ItemValueTypedBenefits';

class BenefitsBody extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    bottomSeparatedBenefitsSysName: PropTypes.array,
    carrierName: PropTypes.string,
    motionLink: PropTypes.string,
  };

  render() {
    const { item, bottomSeparatedBenefitsSysName, carrierName, motionLink } = this.props;
    if (item.valueIn || item.valueOut) {
      return (
        <Grid columns={2} className={`${bottomSeparatedBenefitsSysName.includes(item.sysName) ? 'bottom-separated' : 'bottom-separated-light'}`}>
          <Grid.Row>
            <Grid.Column className="two-cols-benefits content-col">
              <ItemValueTypedBenefits
                item={item}
                benefits="in"
                carrierName={carrierName}
                motionLink={motionLink}
              />
            </Grid.Column>
            <Grid.Column className="two-cols-benefits content-col white">
              <ItemValueTypedBenefits
                item={item}
                benefits="out"
                carrierName={carrierName}
                motionLink={motionLink}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return (
      <Grid columns={1} className="bottom-separated">
        <Grid.Row className="center-aligned">
          <Grid.Column className="one-col-benefits content-col">
            <ItemValueTypedBenefits item={item} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default BenefitsBody;
