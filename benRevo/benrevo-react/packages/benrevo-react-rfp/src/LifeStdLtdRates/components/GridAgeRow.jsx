import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

class GridAgeLifeRow extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updateAgeForm: PropTypes.func.isRequired,
    age: PropTypes.object.isRequired,
    employee: PropTypes.bool.isRequired,
    employeeTobacco: PropTypes.bool.isRequired,
    spouse: PropTypes.bool.isRequired,
    withoutRenewal: PropTypes.bool,
    withoutCurrent: PropTypes.bool,
  };
  render() {
    const { section, index, age, updateAgeForm, employee, employeeTobacco, spouse, withoutRenewal, withoutCurrent } = this.props;
    return (
      <Grid.Row columns={(withoutRenewal || withoutCurrent) ? 3 : 6}>
        {!withoutCurrent &&
          <Grid.Column textAlign="center" className="rfpColumnPadding">
            { employee &&
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              placeholder={'$'}
              name={`currentEmp_${index}`}
              value={(age.currentEmp !== null) ? age.currentEmp : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => { updateAgeForm(section, index, 'currentEmp', (inputState.value) ? parseFloat(inputState.value) : null); }}
              className="currentEmp"
            />
            }
          </Grid.Column>
        }
        { !withoutRenewal &&
          <Grid.Column textAlign="center" className="rfpColumnPadding">
            { employee &&
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              placeholder={'$'}
              name={`renewalEmp_${index}`}
              value={(age.renewalEmp !== null) ? age.renewalEmp : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => {
                updateAgeForm(section, index, 'renewalEmp', (inputState.value) ? parseFloat(inputState.value) : null);
              }}
              className="renewalEmp"
            />
            }
          </Grid.Column>
        }
        {!withoutCurrent &&
          <Grid.Column textAlign="center" className="rfpColumnPadding">
            { employeeTobacco &&
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              placeholder={'$'}
              name={`currentEmpT_${index}`}
              value={(age.currentEmpTobacco !== null) ? age.currentEmpTobacco : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => {
                updateAgeForm(section, index, 'currentEmpTobacco', (inputState.value) ? parseFloat(inputState.value) : null);
              }}
              className="currentEmpTobacco"
            />
            }
          </Grid.Column>
        }
        {!withoutRenewal &&
          <Grid.Column textAlign="center" className="rfpColumnPadding">
            { employeeTobacco &&
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              placeholder={'$'}
              name={`renewalEmpT_${index}`}
              value={(age.renewalEmpTobacco !== null) ? age.renewalEmpTobacco : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => {
                updateAgeForm(section, index, 'renewalEmpTobacco', (inputState.value) ? parseFloat(inputState.value) : null);
              }}
              className="renewalEmpTobacco"
            />
            }
          </Grid.Column>
        }
        {!withoutCurrent &&
          <Grid.Column textAlign="center" className="rfpColumnPadding">
            { spouse &&
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              placeholder={'$'}
              name={`currentSpouse_${index}`}
              value={(age.currentSpouse !== null) ? age.currentSpouse : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => {
                updateAgeForm(section, index, 'currentSpouse', (inputState.value) ? parseFloat(inputState.value) : null);
              }}
              className="currentSpouse"
            />
            }
          </Grid.Column>
        }
        {!withoutRenewal &&
          <Grid.Column textAlign="center" className="rfpColumnPadding">
            { spouse &&
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              placeholder={'$'}
              name={`renewalSpouse_${index}`}
              value={(age.renewalSpouse !== null) ? age.renewalSpouse : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => {
                updateAgeForm(section, index, 'renewalSpouse', (inputState.value) ? parseFloat(inputState.value) : null);
              }}
              className="renewalSpouse"
            />
            }
          </Grid.Column>
        }
      </Grid.Row>
    );
  }
}

export default GridAgeLifeRow;
