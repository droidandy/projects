import React from 'react';
import PropTypes from 'prop-types';
import {
  PresentationSection,
} from '@benrevo/benrevo-react-quote';
import OptionsPage from './sub/OptionsPage';
import ComparePage from './sub/ComparePage';
import AlternativesPage from './sub/AlternativesPage';
import OverviewPage from './sub/OverviewPage';
import NetworksPage from './sub/NetworksPage';
import ComparisonPage from './sub/ComparisonPage';

class SectionPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
  };

  render() {
    const section = this.props.routes[3].path;

    return (
      <PresentationSection
        section={section}
        routes={this.props.routes}
        Options={OptionsPage}
        Compare={ComparePage}
        Alternatives={AlternativesPage}
        Overview={OverviewPage}
        Networks={NetworksPage}
        Comparsion={ComparisonPage}
      />
    );
  }
}

export default SectionPage;
