import React from 'react';
import PropTypes from 'prop-types';
import { Header, Form, Dropdown, Icon } from 'semantic-ui-react';
import Select from 'react-select';
import { CARRIERS } from '../../constants';

class InfoCarrierItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const title = (this.props.name === CARRIERS) ? 'Which carrier are you currently with?' : 'Which carrier were you with previously?';
    const title2 = (this.props.name === CARRIERS) ? 'How many years have you been with them?' : 'How many years were you with them?';
    const arrowRenderer = () => <Icon name="dropdown" />;
    return (
      <div className="rpfMedicalInfoCarriers">
        <Header as="h3" id="carriers" className="rfpPageFormSetHeading">{title}</Header>
        <div name={this.props.name}>
          <Select
            value={this.props.item.title}
            className="react-select"
            clearable
            arrowRenderer={arrowRenderer}
            onCloseResetsInput={false}
            placeholder="Select a Carrier"
            labelKey="text"
            onChange={ (e) => { this.props.updateCarrier(this.props.section, this.props.name, 'title', (e) ? e.value : '', this.props.index); }}
            options={this.props.carriersList}
          />
        </div>

        { this.props.index >= 1 &&
        <span className="rfpRemoveBLock" onClick={ () => { this.props.removeCarrier(this.props.section, this.props.name, this.props.index); } }>Remove</span>
        }
        <Form.Field inline className="rfpBlock">
          <Header as="h3" id="" className="rfpPageFormSetHeading">{title2}</Header>
          <Dropdown name={this.props.name} placeholder='Select a year' selection options={this.props.years} value={this.props.item.years} className="yearsBlock"
                    onChange={ (e, inputState) => { this.props.updateCarrier(this.props.section, this.props.name, 'years', inputState.value, this.props.index); }}
          />
        </Form.Field>
      </div>
    );
  }
}

InfoCarrierItem.propTypes = {
  name: PropTypes.string.isRequired,
  section: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  carriersList: PropTypes.array.isRequired,
  years: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  removeCarrier: PropTypes.func.isRequired,
  updateCarrier: PropTypes.func.isRequired,
  previous: PropTypes.bool,
};

export default InfoCarrierItem;
