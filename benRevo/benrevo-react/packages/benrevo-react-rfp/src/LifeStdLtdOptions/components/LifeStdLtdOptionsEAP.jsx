import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Button, Form, Icon, Radio } from 'semantic-ui-react';

class LifeStdLtdOptionsEAP extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    eap: PropTypes.string,
    visits: PropTypes.number,
    updateForm: PropTypes.func.isRequired,
  };

  render() {
    const {
      section,
      eap,
      visits,
      updateForm,
    } = this.props;

    return (
      <Grid stackable columns={2} className="inner-grid-segment">
        <Grid.Row className={(eap === 'no') ? 'rfpRowDivider' : ''}>
          <Grid.Column width={5}>
            <Header as="h3" className="rfpPageSectionHeading">Employee Assistance Program</Header>
          </Grid.Column>
          <Grid.Column width={11}>
            <Header as="h3" className="rfpPageFormSetHeading">Does your current plan include a value-add EAP?</Header>
            <Form>
              <Form.Field>
                <Radio
                  label="Yes"
                  value="yes"
                  checked={eap === 'yes'}
                  onChange={(e, inputState) => { updateForm(section, 'eap', inputState.value); }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="No"
                  value="no"
                  checked={eap === 'no'}
                  onChange={(e, inputState) => { updateForm(section, 'eap', inputState.value); }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
        { eap === 'yes' &&
        <Grid.Row className="rfpRowDivider">
          <Grid.Column width={5} />
          <Grid.Column tablet={8} computer={7}>
            <Header as="h3" className="rfpPageFormSetHeading">How many face-to-face visits?</Header>
            <div className="count-control rfpBlock">
              <Button onClick={() => { let num = visits; updateForm(section, 'visits', num += 1); }} icon size="medium"><Icon name='plus' /></Button>
              <span className="indicator big">{ visits }</span>
              <Button disabled={visits === 1} onClick={() => { let num = visits; updateForm(section, 'visits', num -= 1); }} icon size="medium"><Icon name='minus' /></Button>
            </div>
          </Grid.Column>
        </Grid.Row>
        }
      </Grid>
    );
  }
}

export default LifeStdLtdOptionsEAP;
