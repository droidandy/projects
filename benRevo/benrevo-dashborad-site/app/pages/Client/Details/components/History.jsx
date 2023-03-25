import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, TextArea, Loader } from 'semantic-ui-react';

class History extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    historyData: PropTypes.string.isRequired,
    historyEdits: PropTypes.string.isRequired,
    isInEditMode: PropTypes.bool.isRequired,
    toggleEditMode: PropTypes.func.isRequired,
    updateHistoryText: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
  };

  render() {
    const { historyData, historyEdits, isInEditMode, toggleEditMode,
            updateHistoryText, loading, save } = this.props;
    return (
      <Card className="card-main history" fluid>
        <Card.Content>
          <Card.Header>
            History
            <div className="header-buttons">
              { !isInEditMode && <Button basic onClick={() => { toggleEditMode(); }}>{ historyData.length === 0 ? 'Add Notes' : 'Edit Notes'}</Button> }
            </div>
          </Card.Header>
          <Loader active={loading} />
          { !loading &&
            <div className="history-notes">
              { !isInEditMode ?
                (<p>{historyData || 'No history data'}</p>)
                :
                (<div className="history-edit-area">
                  <TextArea autoHeight className="history-text-area" value={historyEdits || historyData} onChange={(e, inputState) => { updateHistoryText(inputState.value); }} />
                  { isInEditMode &&
                    <div className="edit-buttons">
                      <a tabIndex="0" className="cancel-button" onClick={() => { toggleEditMode(); }}>Cancel</a>
                      <Button primary onClick={() => { save(); }}>Save</Button>
                    </div>
                  }
                </div>)
              }
            </div>
          }
        </Card.Content>
      </Card>
    );
  }
}

export default History;
