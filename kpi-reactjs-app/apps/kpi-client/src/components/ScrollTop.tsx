import * as React from 'react';
import styled, { keyframes } from 'styled-components';

interface ScrollTopProps {
  className?: string;
}

const _ScrollTop = (props: ScrollTopProps) => {
  const { className } = props;
  const [isVisible, setIsVisible] = React.useState(window.scrollY > 100);

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={className}
      onClick={() => {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      }}
    >
      {' '}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
        height="20px"
        viewBox="0 0 448 512"
      >
        <path
          fill="white"
          d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
        ></path>
      </svg>
    </div>
  );
};

const showAnimation = keyframes`
  from {
    margin-bottom: -15px;
  }
  t {
    margin-bottom: 0;
  }
`;

export const ScrollTop = styled(_ScrollTop)`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  position: fixed;
  bottom: 40px;
  left: 20px;
  cursor: pointer;
  z-index: 100;
  background: #5d78ff;
  box-shadow: 0 0 15px 1px rgba(69, 65, 78, 0.2);
  border-radius: 4px;
  opacity: 0.3;
  display: flex;
  animation: ${showAnimation} 0.4s ease-out 1;
  &:hover {
    opacity: 1;
  }
  .sidepanel-open & {
    display: none;
  }
`;
