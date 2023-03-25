import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input, Header } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import { RFP_LIFE_SECTION } from './../../constants';

class SetAgeRow extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updateAgeForm: PropTypes.func.isRequired,
    age: PropTypes.object.isRequired,
    maxIndex: PropTypes.number.isRequired,
  };
  render() {
    const { section, index, age, updateAgeForm, maxIndex } = this.props;
    return (
      <Grid.Row columns={4} className={section === RFP_LIFE_SECTION ? 'setAgeRow' : 'noPaddedRow setAgeRow'} key={`setRow-${index}`}>
        <Grid.Column>
          <Header as="h3" id="ageFrom" className="rfpPageFormSetHeading minHeightFix topPadded">Age</Header>
        </Grid.Column>
        <Grid.Column>
          <NumberFormat
            customInput={Input}
            name={`ageFrom_${index}`}
            disabled
            value={(age.from !== null) ? age.from : ''}
            fluid
            allowNegative={false}
            onValueChange={(inputState) => { updateAgeForm(section, index, 'from', inputState.value); }}
            className="ageFrom"
          />
        </Grid.Column>
        <Grid.Column>
          <Header as="h3" id="ageTo" className="rfpPageFormSetHeading minHeightFix topPadded">to</Header>
        </Grid.Column>
        <Grid.Column>
          <NumberFormat
            customInput={Input}
            name={`ageTo_${index}`}
            disabled={index !== maxIndex}
            value={(age.to !== null) ? age.to : ''}
            fluid
            allowNegative={false}
            onValueChange={(inputState) => { updateAgeForm(section, index, 'to', inputState.value); }}
            className="ageTo"
          />
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default SetAgeRow;
