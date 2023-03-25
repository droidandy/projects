import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { rtlMargin } from 'shared/rtl';

interface SidePanelProps {
  title?: React.ReactNode;
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
}

const GlobalStyle = createGlobalStyle`
.sidepanel-open {
  overflow: hidden
}

`;

const SidePanelContent = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  background: white;
  position: absolute;
  height: 100%;
  right: 0;
  left: auto;

  .sidepanel-enter & {
    transform: translateX(400px);
  }

  .sidepanel-enter.sidepanel-enter-active & {
    transition: transform 0.3s ease;
    transform: translateX(0);
  }

  .sidepanel-leave & {
    transform: translateX(0);
  }

  .sidepanel-leave.sidepanel-leave-active & {
    transition: transform 0.3s ease;
    transform: translateX(400px);
  }
`;

const SidePanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: 1px solid #ebedf2;
`;

const SidePanelBody = styled.div`
  flex: 1 1 auto;
  overflow: auto;
  transition: max-height 0.2s ease-in-out;
  padding: 1.25rem;
  pre[class*='language-'] {
    margin: 0;
    max-height: 80vh;
    overflow: auto;
  }
`;
const SidePanelTitle = styled.h5`
  margin: 0;
  line-height: 1.5;
  font-size: 1.3rem;
  color: #464457;
`;

const Close = styled.button`
  padding: 16px;
  margin: -16px;
  ${rtlMargin('auto', '-16px')}
  background-color: transparent;
  border: 0;
  appearance: none;
  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;

  &:hover {
    opacity: 0.75;
    cursor: pointer;
  }
`;

const AbsoluteClose = styled(Close)`
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 10;
  opacity: 1;
  color: #333;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 100;
`;

const Alpha = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);

  .sidepanel-enter & {
    opacity: 0.01;
  }

  .sidepanel-enter.sidepanel-enter-active & {
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }

  .sidepanel-leave & {
    opacity: 1;
  }

  .sidepanel-leave.sidepanel-leave-active & {
    opacity: 0.01;
    transition: opacity 0.3s ease-in-out;
  }
`;

export function SidePanel(props: SidePanelProps) {
  const { isOpen, close, children, title } = props;
  React.useEffect(() => {
    if (!isOpen) {
      return () => {
        //
      };
    }
    document.body.classList.add('sidepanel-open');
    const onKeyPress = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keyup', onKeyPress);
    return () => {
      document.body.classList.remove('sidepanel-open');
      window.removeEventListener('keyup', onKeyPress);
    };
  }, [isOpen]);
  return (
    <>
      <GlobalStyle />
      <ReactCSSTransitionGroup
        transitionName="sidepanel"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        {isOpen && (
          <Wrapper
            data-sidepanel-wrapper
            onClick={e => {
              const target = e.target as HTMLDivElement;
              if (target.hasAttribute('data-sidepanel-wrapper')) {
                close();
              }
            }}
          >
            <Alpha onClick={close}></Alpha>
            <SidePanelContent>
              {title ? (
                <SidePanelHeader>
                  {<SidePanelTitle>{title}</SidePanelTitle>}
                  <Close onClick={close}>×</Close>
                </SidePanelHeader>
              ) : (
                <AbsoluteClose onClick={close}>×</AbsoluteClose>
              )}
              <SidePanelBody>{children}</SidePanelBody>
            </SidePanelContent>
          </Wrapper>
        )}
      </ReactCSSTransitionGroup>
    </>
  );
}
