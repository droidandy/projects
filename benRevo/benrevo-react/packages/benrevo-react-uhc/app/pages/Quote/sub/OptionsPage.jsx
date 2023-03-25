import { connect } from 'react-redux';
import React from 'react';
import {
  Options,
} from '@benrevo/benrevo-react-quote';

class OptionsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const showEmptyOption = false;
    const hasClearValue = false;

    return (
      <Options
        { ...this.props }
        showQuotes
        showDtp={false}
        hasClearValue={hasClearValue}
        showEmptyOption={showEmptyOption}
        noButton
      />
    )
  }
}

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps, null)(OptionsPage);
