import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import ItemValueTyped from './ItemValueTyped';

class BenefitsBody extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    bottomSeparatedBenefitsSysName: PropTypes.array.isRequired,
    carrierName: PropTypes.string.isRequired,
  };

  render() {
    const {
      item,
      bottomSeparatedBenefitsSysName,
      carrierName,
    } = this.props;
    if (item.valueIn || item.valueOut) {
      return (
        <Grid columns={2} className={`${bottomSeparatedBenefitsSysName.includes(item.sysName) ? 'bottom-separated' : 'bottom-separated-light'}`}>
          <Grid.Row>
            <Grid.Column className="two-cols benefits content-col">
              <ItemValueTyped
                item={item}
                benefits="in"
                carrierName={carrierName}
              />
            </Grid.Column>
            <Grid.Column className="two-cols benefits content-col white">
              <ItemValueTyped
                item={item}
                benefits="out"
                carrierName={carrierName}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return (
      <Grid columns={1} className="bottom-separated">
        <Grid.Row className="center-aligned">
          <Grid.Column className="one-col benefits content-col">
            <ItemValueTyped item={item} benefits={''} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default BenefitsBody;
