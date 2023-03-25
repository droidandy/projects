import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';

class ReviewItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    data: PropTypes.array.isRequired,
    category: PropTypes.string.isRequired,
  };

  render() {
    const { data, category } = this.props;
    return (
      <Grid.Column width={16}>
        {
          data.map((item, i) =>
            <Grid key={i} className="review-item">
              <Grid.Row>
                <Grid.Column width={16} className="header-main">
                  <Header as="h2">{category} {item.planType}</Header>
                  <div className="divider" />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="review-item-row">
                <Grid.Column width={5}>
                  <span>Carrier</span>
                </Grid.Column>
                <Grid.Column width={11}>
                  <span>{item.selectedCarrier.displayName || '-'}</span>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="review-item-row">
                <Grid.Column width={5}>
                  <span>Network</span>
                </Grid.Column>
                <Grid.Column width={11}>
                  <span>{item.selectedNetwork.name || '-'}</span>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="review-item-row">
                <Grid.Column width={5}>
                  <span>Plan name</span>
                </Grid.Column>
                <Grid.Column width={11}>
                  <span>{item.planName || '-'}</span>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="review-item-row">
                <Grid.Column width={5}>
                  <span>BENEFITS</span>
                </Grid.Column>
              </Grid.Row>
              { item.benefits.map((benefit, j) =>
                <Grid.Row key={j} className="review-item-row">
                  <Grid.Column width={5}>
                    <span>{benefit.name}</span>
                  </Grid.Column>
                  <Grid.Column width={11}>
                    { benefit.valueIn && benefit.valueOut &&
                    <Grid>
                      <Grid.Row>
                        <Grid.Column width={3}>{benefit.valueIn || '-'}</Grid.Column>
                        <Grid.Column width={3}>{benefit.valueOut || '-'}</Grid.Column>
                      </Grid.Row>
                    </Grid>
                    }
                    { benefit.value && <span>{benefit.value || '-'}</span> }
                  </Grid.Column>
                </Grid.Row>
              )}
              { item.rx && item.rx.length &&
              <Grid.Row className="review-item-row">
                <Grid.Column width={5}>
                  <span>RX</span>
                </Grid.Column>
              </Grid.Row>
              }
              { item.rx && item.rx.length && item.rx.map((rx, j) =>
                <Grid.Row key={j} className="review-item-row">
                  <Grid.Column width={5}>
                    <span>{rx.name}</span>
                  </Grid.Column>
                  <Grid.Column width={11}>
                    <span>{rx.value || '-'}</span>
                  </Grid.Column>
                </Grid.Row>
              )}
            </Grid>
          )
        }
      </Grid.Column>
    );
  }
}

export default ReviewItem;
