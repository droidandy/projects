import React from 'react';
import PropTypes from 'prop-types';
import { RFPSection } from '@benrevo/benrevo-react-rfp';
import SubNavigation from '../components/SubNavigation';
import messages from '../messages';

class SectionPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
  };

  render() {
    const { clientId } = this.props.params;

    return (
      <div>
        <SubNavigation
          route={this.props.route}
          messages={messages}
          prefix={`/clients/${clientId}`}
          products={this.props.products}
          virginCoverage={this.props.virginCoverage}
          parent="rfp"
        />
        <RFPSection
          {...this.props}
          hideNav
        />
      </div>
    );
  }
}

export default SectionPage;
