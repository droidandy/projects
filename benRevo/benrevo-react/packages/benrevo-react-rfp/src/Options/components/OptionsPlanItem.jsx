import React from 'react';
import PropTypes from 'prop-types';
import { Header, Grid, Input, Dropdown, Popup } from 'semantic-ui-react';
import { RFP_MEDICAL_SECTION, PLANS } from './../../constants';

class OptionsPlanItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();

    this.updatePlan = this.updatePlan.bind(this);
  }

  updatePlan(value) {
    const { updatePlan, index, section, item, changeCarrier } = this.props;

    if (item.selectedCarrier.carrierId) {
      changeCarrier(section, item.selectedCarrier.carrierId, index, value, true);
    }

    updatePlan(section, 'title', value, index);
  }

  render() {
    const { updatePlan, item, index, planList, section, carrierList, planNetworks, changeCarrier, changeNetwork, virgin, hideNetworks, hideTypes } = this.props;
    const PopUp = () => <Popup
      position="top center"
      size="tiny"
      trigger={<span className="field-info" />}
      content="Select PPO for EPO and HRA plans."
      inverted
    />;
    const networkList = (planNetworks[index]) ? planNetworks[index] : [];

    return (
      <Grid.Row className="optionsPlanItemRow" centered>
        {!virgin &&
        <Grid.Column width={5} className="option-column">
          <Header as="h3" className="rfpPageFormSetHeading minHeightFix">
            Carrier
          </Header>
          <Dropdown name={PLANS} placeholder='Plan' search selection options={carrierList} value={item.selectedCarrier.carrierId || ''} fluid
                    onChange={ (e, inputState) => { changeCarrier(section, inputState.value, index, item.title, true); }} />
        </Grid.Column>
        }
        { !hideTypes &&
          <Grid.Column width={(!virgin) ? 3 : 5} className="option-column">
            <Header as="h3" className="rfpPageFormSetHeading minHeightFix">
              Type
              { section === RFP_MEDICAL_SECTION &&
              <PopUp />
              }
            </Header>
            <Dropdown name={PLANS} placeholder='Plan' search selection options={planList} value={item.title} fluid
                      onChange={ (e, inputState) => { this.updatePlan(inputState.value); }} />
          </Grid.Column>
        }

        {!virgin && !hideNetworks &&
        <Grid.Column width={4} className="option-column">
          <Header as="h3" className="rfpPageFormSetHeading minHeightFix">
            Network Name
          </Header>
          <Dropdown name={PLANS} placeholder='Plan' search selection options={networkList} value={item.selectedNetwork.networkId || ''} fluid
                    onChange={ (e, inputState) => { changeNetwork(section, inputState.value, index, item.title); }} />
        </Grid.Column>
        }
        <Grid.Column width={(!virgin) ? 4 : 5} className="option-column">
          <Header as="h3" className="rfpPageFormSetHeading minHeightFix">{ !virgin ? 'Incumbent plan name' : 'Plan name' }</Header>
          <Input name={PLANS} value={item.name ? item.name : ''} fluid
                 onChange={ (e, inputState) => { updatePlan(section, 'name', inputState.value, index); }} />
        </Grid.Column>
      </Grid.Row>
    );
  }
}

OptionsPlanItem.propTypes = {
  section: PropTypes.string.isRequired,
  virgin: PropTypes.bool.isRequired,
  hideNetworks: PropTypes.bool,
  hideTypes: PropTypes.bool,
  item: PropTypes.object.isRequired,
  planList: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  updatePlan: PropTypes.func.isRequired,
  planNetworks: PropTypes.object.isRequired,
  carrierList: PropTypes.array.isRequired,
  changeCarrier: PropTypes.func.isRequired,
  changeNetwork: PropTypes.func.isRequired,
};

export default OptionsPlanItem;
