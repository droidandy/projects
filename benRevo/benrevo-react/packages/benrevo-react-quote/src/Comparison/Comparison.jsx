import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Dimmer, Loader, Header, Button } from 'semantic-ui-react';
import ComparisonTable from './components/ComparisonTable';

class Comparison extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    getComparison: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    section: PropTypes.string.isRequired,
    openedOption: PropTypes.object.isRequired,
    changePage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      column: null,
      stateRows: [],
      direction: null,
    };
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    const { getComparison } = this.props;
    getComparison();
  }

  render() {
    const { loading, section, openedOption, changePage } = this.props;
    if (!loading) {
      return (
        <div className="comparison-page">
          <div className="breadcrumb">
            <a onClick={() => { changePage(section, 'Options'); }}>{section} Options</a>
            <span>
              {' > '}
              </span>
            <a onClick={() => { changePage(section, 'Overview'); }}>{openedOption.name}</a>
            <span>
              {' > '}
              </span>
            <a>Compare Providers</a>
          </div>
          <div className="divider"></div>
          <Header className="presentation-options-header" as="h2">Compare Providers</Header>
          <ComparisonTable {...this.props} />
          <div className="divider"></div>

          <Grid stackable className="buttonRow">
            <Grid.Row>
              <Grid.Column width={16} textAlign="right">
                <Button size="big" primary onClick={() => { changePage(section, 'Overview'); }}>Back to Overview</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }
    const active = true;
    return (
      <div className="presentation-alternatives dimmer">
        <Dimmer active={active} inverted>
          <Loader indeterminate size="big">Getting medical groups</Loader>
        </Dimmer>
      </div>
    );
  }
}

export default Comparison;
