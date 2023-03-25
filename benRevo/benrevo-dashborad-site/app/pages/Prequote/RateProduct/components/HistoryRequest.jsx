import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';


class HistoryRequest extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    history: PropTypes.array,
    types: PropTypes.object,
  };
  render() {
    const { history, types } = this.props;
    return (
      <div className="history-list">
        <Header as="h3" className="title-form">History of request(s):</Header>
        { history.map((item, i) =>
          <div className="history-item" key={i}>
            <div className="history-info">{types[item.name]}</div>
            <div className="history-date">{item.date}</div>
          </div>
        )}
      </div>
    );
  }
  }

export default HistoryRequest;
