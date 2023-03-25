// @flow
import React from 'react';
import Typed from 'typed.js';
import styled from 'styled-components';

const TextWrapper = styled.div`
  color: #757575;
  font-size: 26px;
  font-weight: bold;
`;

export type TypedTextProps = {
  strings: string[],
};

class TypedText extends React.Component {
  componentDidMount() {
    const { strings } = this.props;
    // You can pass other options here, such as typing speed, back speed, etc.
    const options = {
      strings,
      typeSpeed: 50,
      backSpeed: 50,
    };
    // this.el refers to the <span> in the render() method
    this.typed = new Typed(this.el, options);
  }

  componentWillUnmount() {
    // Make sure to destroy Typed instance on unmounting
    // to prevent memory leaks
    this.typed.destroy();
  }
  props: TypedTextProps;
  render() {
    return (
      <div className="wrap">
        <TextWrapper className="type-wrap">
          <span
            style={{ whiteSpace: 'pre' }}
            ref={el => {
              this.el = el;
            }}
          />
        </TextWrapper>
      </div>
    );
  }
}

export default TypedText;
