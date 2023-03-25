import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

class Navigation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clientName: PropTypes.string,
    client: PropTypes.object,
    type: PropTypes.string,
    goToClient: PropTypes.func.isRequired,
    inner: PropTypes.object,
  };

  static defaultProps = {
    clientName: '',
    type: '',
    client: {},
    inner: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      right: 0,
    };

    this.calculate = this.calculate.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.calculate);
  }

  componentDidMount() {
    this.calculate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calculate);
  }

  calculate() {
    const rect = (this.titleElem) ? this.titleElem.getBoundingClientRect() : {};

    this.setState({ right: (window.innerWidth - rect.left) - 30 });
  }

  render() {
    const { clientName, type, client, goToClient, inner } = this.props;
    const { right } = this.state;
    let color = 'grey';

    if (type === 'rfp') color = 'green';

    return (
      <div className="navigation">
        <div className={`navigation-title-bg ${color}`} style={{ right }} />
        <Grid stackable container>
          <Grid.Column width={16}>
            { client.id && <a tabIndex={0} ref={(c) => { this.titleElem = c; }} className={`navigation-title ${color}`} onClick={() => { goToClient(client.id); }}>{client.clientName}</a> }
            { !client.id && <div ref={(c) => { this.titleElem = c; }} className={`navigation-title ${color}`}>{clientName}</div> }
            {type && <div className={`navigation-title-sub ${color}`}>{type}</div> }
            {inner}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Navigation;
