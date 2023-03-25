import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import CarrierLogo from './../../CarrierLogo';

class CardItemEmpty extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string,
    mainCarrier: PropTypes.object,
  };

  render() {
    const { mainCarrier, section } = this.props;

    return (
      <Card as="div" className="card-empty">
        <div>
          <Card.Content className="content-top">
            <Card.Header>
              Option 1
            </Card.Header>
            <CarrierLogo carrier={mainCarrier.carrier.name} quoteType="STANDARD" section={section} />
          </Card.Content>
          <div className="card-empty-layer">
            <div className="card-empty-bottom">
              <div className="card-empty-img" />
              <div className="card-empty-title1">Standard quote is on the way...</div>
              <div className="card-empty-title2">We’ll send you an email when it’s ready.</div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

export default CardItemEmpty;
