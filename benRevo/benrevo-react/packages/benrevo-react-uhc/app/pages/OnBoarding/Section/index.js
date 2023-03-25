import React from 'react';
import {
  Section,
} from '@benrevo/benrevo-react-onboarding';
import Questions from '../questions';

class SectionPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Section
        {...this.props}
        Questions={Questions}
        showCopyClient
      />
    );
  }
}

export default SectionPage;
