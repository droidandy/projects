import React from "react";
import SC from 'styled-components';
import { useSpring, animated } from "react-spring";
import { Icon } from './icon';

const Container = SC.div`
  position: relative;
  justify-content: space-between;
  border: 1px solid #DFE3F3;
  box-sizing: border-box;
  border-radius: 3px;
  margin: 10px 0;
  padding: 0 20px;
`;

const Title = SC.div`
  width: 100%;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #008E5B;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Header = SC.div`
  display: flex;
  align-items: center;
  min-height: 51px;
  overflow: hidden;
  justify-content: space-between;
  cursor: pointer;
  margin: 7px 0 0 0;
`;

const Content = SC.div`
  margin: 0 0 20px 0;
  overflow: auto;
`;

const Arrow = SC.div`
  margin: 0 0 0 20px;
`;

const contentAnimation = {
  false: {
    opacity: 0,
    transform: "translateY(-20px)",
    delay: 30,
    maxHeight: "0px",
    display: 'none',
  },
  true: {
    maxHeight: "1000px",
    opacity: 1,
    transform: "translateY(0)",
    delay: 0,
    display: 'block',
  }
};

const arrowAnimation = {
  false: {
    transform: "rotatex(0deg)",
    delay: 30,
  },
  true: {
    transform: "rotatex(-180deg)",
    delay: 0,
  }
};

export const Accordion = ({ title, children }) => {
  const [open, setOpen] = React.useState(false);
  const content = useSpring(contentAnimation[open]);
  const arrow = useSpring(arrowAnimation[open]);
  return (
    <Container>
      <Header onClick={() => setOpen(!open)}>
        <Title>{title}</Title>
        <animated.div style={arrow}>
          <Arrow><Icon name="arrowDown" size="24" /></Arrow>
        </animated.div>
      </Header>
      <animated.div style={content}>
        <Content>
          {children}
        </Content>
      </animated.div>
    </Container>
  );
};

