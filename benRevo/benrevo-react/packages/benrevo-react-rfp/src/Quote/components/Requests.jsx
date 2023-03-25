import React from 'react';
import PropTypes from 'prop-types';
import { Header, Grid, Form, TextArea } from 'semantic-ui-react';
import { CHANGE_ADDITIONAL_REQUESTS, CHANGE_ALTERNATIVE_QUOTE, RFP_MEDICAL_SECTION } from '../../constants';

class Requests extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    alternativeQuote: PropTypes.string,
    updateForm: PropTypes.func,
    claimsHeader: PropTypes.func.isRequired,
    additionalRequests: PropTypes.string,
    section: PropTypes.string,
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { section, alternativeQuote, updateForm, additionalRequests, claimsHeader } = this.props;

    return (
      <Grid.Row className="rfpRowDivider">
        <Grid.Column width={5}>
          <Header as="h3" className="rfpPageSectionHeading">Additional quote requests</Header>
        </Grid.Column>
        <Grid.Column width={11}>
          <Header as="h3" className="rfpPageFormSetHeading">Would you like to quote an alternative?</Header>
          <Form>
            <Form.Group inline>
              <Form.Radio
                label="Yes"
                name="waitingRadioGroup"
                value="yes"
                checked={alternativeQuote === 'yes'}
                onChange={(e, inputState) => {
                  updateForm(section, CHANGE_ALTERNATIVE_QUOTE, inputState.value);
                }}
              />
              <Form.Radio
                label="No"
                name="waitingRadioGroup"
                value="no"
                checked={alternativeQuote === 'no'}
                onChange={(e, inputState) => {
                  updateForm(section, CHANGE_ALTERNATIVE_QUOTE, inputState.value);
                }}
              />
            </Form.Group>
          </Form>
          { section === RFP_MEDICAL_SECTION &&
            claimsHeader()
          }
          <Header as="h3" className="rfpPageFormSetHeading">Please include any additional requests:</Header>
          <Form>
              <TextArea
                className="rfpQuoteTextarea2" value={additionalRequests} onChange={(e, inputState) => { updateForm(section, CHANGE_ADDITIONAL_REQUESTS, inputState.value); }}
              />
          </Form>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

Requests.propTypes = {
  section: PropTypes.string.isRequired,
};

export default Requests;
