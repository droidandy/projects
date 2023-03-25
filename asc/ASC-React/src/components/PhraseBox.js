import React from 'react';

import {
    Row
} from 'react-onsenui';

class PhraseBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    let altClass = '';
    let authorship = this.props.author === 'me';
    if (authorship) {
      altClass = 'conversation__phraseBox-alt';
    }
    return (
        <div className={'conversation__phraseBox ' + altClass}>
          {authorship
            ? <Row>
                <span style={{marginLeft: 'auto'}}>{this.props.time}</span>
              </Row>
            : <span >{this.props.time}</span>}

          {!authorship
            ? <span style={{padding: '0 10px'}}>{this.props.author}</span>
            : null}
          <div>{this.props.text}</div>
        </div>
    );
  }
}

export default PhraseBox;
