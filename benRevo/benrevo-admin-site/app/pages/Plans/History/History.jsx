import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

class History extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    history: PropTypes.array,
    getHistory: PropTypes.func,
  };

  componentWillMount() {
    this.props.getHistory();
  }

  render() {
    const { history } = this.props;
    return (
      <div className="plans-history">
        <Header as="h4" textAlign="left" className="title">History</Header>
        {history.map((item, index) =>
          <div key={index} className="history-item">
            <div>{item.name}</div>
            <div>{item.date}</div>
          </div>
        )}
      </div>
    );
  }
}

export default History;
