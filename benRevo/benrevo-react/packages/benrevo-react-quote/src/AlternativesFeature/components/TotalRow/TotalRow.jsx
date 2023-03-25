import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Dimmer, Loader } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';

class TotalRow extends React.Component {
  static propTypes = {
    section: PropTypes.string.isRequired,
    selectedPlan: PropTypes.object.isRequired,
    selectedRxPlan: PropTypes.object.isRequired,
    currentPlan: PropTypes.object.isRequired,
    loadingAfterSelect: PropTypes.bool.isRequired,
  };

  render() {
    const {
      section,
      selectedPlan,
      selectedRxPlan,
      currentPlan,
      loadingAfterSelect,
    } = this.props;
    return (
      <div className="total-bottom-grid">
        { !loadingAfterSelect &&
        <Grid className="right-grid">
          <Grid.Row>
            <Grid.Column width={16}>
              {section === 'medical' ? `${section.toUpperCase()} + RX SUMMARY` : `${section.toUpperCase()} SUMMARY`}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3} style={{textTransform: 'capitalize'}}>{section} Plan</Grid.Column>
            <Grid.Column width={4}>{selectedPlan ? selectedPlan.name : ''}</Grid.Column>
            <Grid.Column width={5}>Total Monthly Cost</Grid.Column>
            <Grid.Column width={4}>
              <FormattedNumber
                style="currency" // eslint-disable-line react/style-prop-object
                currency="USD"
                minimumFractionDigits={2}
                maximumFractionDigits={2}
                value={(selectedPlan && selectedPlan.total) ? selectedPlan.total : 0}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>{section === 'medical' ? 'RX Plan' : ''}</Grid.Column>
            <Grid.Column width={4}>{selectedRxPlan ? selectedRxPlan.name : selectedRxPlan.name}</Grid.Column>
            <Grid.Column width={5}>$ Difference (%)</Grid.Column>
            <Grid.Column width={4}>
              <FormattedNumber
                style="currency" // eslint-disable-line react/style-prop-object
                currency="USD"
                minimumFractionDigits={2}
                maximumFractionDigits={2}
                value={(currentPlan.total > 0 && selectedPlan) ? (selectedPlan.total - currentPlan.total) : 0}
              /> (
              <FormattedNumber
                style="percent" // eslint-disable-line react/style-prop-object
                minimumFractionDigits={0}
                maximumFractionDigits={1}
                value={(currentPlan.total > 0 && selectedPlan) ? (selectedPlan.total - currentPlan.total) / currentPlan.total : 0}
              />)
            </Grid.Column>
          </Grid.Row>
        </Grid>
        }
        { loadingAfterSelect &&
        <Grid className="right-grid total-dimmer">
          <Grid.Row>
            <Grid.Column width={16}>
              <Dimmer active={loadingAfterSelect}>
                <Loader indeterminate>Loading Total Monthly Cost</Loader>
              </Dimmer>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        }
      </div>
    );
  }
}

export default TotalRow;
