import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Grid, Button } from 'semantic-ui-react';

class TotalBlock extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    selectedMainPlan: PropTypes.object,
    selectedRxPlan: PropTypes.object,
    currentPlan: PropTypes.object,
    closeModal: PropTypes.func.isRequired,
    selectNtPlan: PropTypes.func.isRequired,
    addAltPlan: PropTypes.func.isRequired,
  };
  static defaultProps = {
    selectedMainPlan: null,
    selectedRxPlan: null,
    currentPlan: null,
  };
  render() {
    const {
      section,
      selectedMainPlan,
      selectedRxPlan,
      currentPlan,
      closeModal,
      selectNtPlan,
      addAltPlan,
    } = this.props;
    // console.log('TotalBlock', this.props);
    return (
      <Grid className="rx-footer-block">
        <Grid.Row className="dark header">
          <Grid.Column width={16}>
            <span>Selected {section} + RX Plans</span>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="body-block">
          <Grid.Column width={8}>
            <div className="plan">
              <span className="label">{section} plan</span>
              <span className="name">{selectedMainPlan ? selectedMainPlan.name : ''}</span>
            </div>
            <div className="plan">
              <span className="label">RX plan</span>
              <span className="name">{selectedRxPlan ? selectedRxPlan.name : ''}</span>
            </div>
          </Grid.Column>
          <Grid.Column floated="right" width={3}>
            <div className="header right">
              <FormattedNumber
                style="currency" // eslint-disable-line react/style-prop-object
                currency="USD"
                minimumFractionDigits={2}
                maximumFractionDigits={2}
                value={(selectedMainPlan && selectedMainPlan.total) ? selectedMainPlan.total : 0}
              />
              <div className="sub-header right">total monthly cost</div>
            </div>
          </Grid.Column>
          <Grid.Column floated="right" className="bordered" width={3}>
            <div className="header right">
              <FormattedNumber
                style="currency" // eslint-disable-line react/style-prop-object
                currency="USD"
                minimumFractionDigits={2}
                maximumFractionDigits={2}
                value={(currentPlan.total > 0 && selectedMainPlan) ? (selectedMainPlan.total - currentPlan.total) : 0}
              />
              <div className="sub-header right">$ difference</div>
            </div>
          </Grid.Column>
          <Grid.Column floated="right" className="bordered" width={2}>
            <div className="header center">
              <FormattedNumber
                style="percent" // eslint-disable-line react/style-prop-object
                minimumFractionDigits={0}
                maximumFractionDigits={1}
                value={(currentPlan.total > 0 && selectedMainPlan) ? (selectedMainPlan.total - currentPlan.total) / currentPlan.total : 0}
              />
              <div className="sub-header center">% difference</div>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="dark footer">
          <Grid.Column width={8} className="left">
            <Button inverted onClick={() => closeModal()}>Close</Button>
          </Grid.Column>
          <Grid.Column width={8} className="right">
            <Button primary disabled={!selectedMainPlan} onClick={() => selectNtPlan('rx')}>Replace Match</Button>
            <span className="text">OR</span>
            <Button primary disabled={!selectedMainPlan} onClick={() => addAltPlan('rx')}>Add Alternative</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default TotalBlock;
