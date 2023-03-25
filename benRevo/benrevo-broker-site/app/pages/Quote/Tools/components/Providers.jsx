import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Dimmer, Loader } from 'semantic-ui-react';
import { ComparisonTable } from '@benrevo/benrevo-react-quote';

class ProvidersTools extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    rows: PropTypes.array.isRequired,
    cols: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  render() {
    const { loading } = this.props;

    return (
      <Tab.Pane>
        <div className="medical-groups">
          {!loading &&
            <ComparisonTable
              {...this.props}
            />
          }
          <Dimmer active={loading} inverted>
            <Loader indeterminate size="big">Getting medical groups</Loader>
          </Dimmer>
        </div>
      </Tab.Pane>
    );
  }
}

export default ProvidersTools;
