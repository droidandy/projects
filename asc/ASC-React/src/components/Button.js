import React from 'react';

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className={`custom__button ${this.props.className || ''}`} onClick={this.props.onClick} style={this.props.style}>
        {this.props.text}
      </div>
    );
  }
}

export default Button;
