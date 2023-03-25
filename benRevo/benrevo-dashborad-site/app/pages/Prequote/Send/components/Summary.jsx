import React from 'react';
import PropTypes from 'prop-types';
import { TextArea, Form } from 'semantic-ui-react';

class Summary extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    changeSummary: PropTypes.func.isRequired,
  };

  render() {
    const {
      text,
      changeSummary,
      section,
    } = this.props;
    return (
      <div key={section}>
        <Form>
          <TextArea
            rows={10}
            value={text}
            onChange={(e, inputState) => { changeSummary(inputState.value, section); }}
          />
        </Form>
      </div>
    );
  }
}

export default Summary;
