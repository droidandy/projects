import React from 'react';
import {
  Send,
} from '@benrevo/benrevo-react-onboarding';
import Questions from '../questions';
import { carrierName } from '../../../config';

class SectionPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Send
        {...this.props}
        Questions={Questions}
        carrierName={carrierName}
      />
    );
  }
}

export default SectionPage;
