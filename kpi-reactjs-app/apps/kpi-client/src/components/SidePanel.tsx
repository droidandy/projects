import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

interface SidePanelProps extends SidePanelContentProps {
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
}

const GlobalStyle = createGlobalStyle`
.sidepanel-open {
  overflow: hidden
}

`;

interface SidePanelContentProps {
  size?: 'default' | 'large';
}

const SidePanelContent = styled.div<SidePanelContentProps>`
  width: ${props => (props.size === 'large' ? 640 : 400)}px;
  display: flex;
  flex-direction: column;
  background: white;
  position: absolute;
  height: 100%;
  top: 0;
  right: auto;
  left: 0;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);

  .sidepanel-enter & {
    transform: translateX(-400px);
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
    transform: translateX(-400px);
  }
`;

const SidePanelBody = styled.div`
  flex: 1 1 auto;
  overflow: auto;
  position: relative;
  transition: max-height 0.2s ease-in-out;
  pre[class*='language-'] {
    margin: 0;
    max-height: 80vh;
    overflow: auto;
  }
`;
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 100;
`;

export function SidePanel(props: SidePanelProps) {
  const { isOpen, close, children, size } = props;
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
            <SidePanelContent size={size}>
              <SidePanelBody>{children}</SidePanelBody>
            </SidePanelContent>
          </Wrapper>
        )}
      </ReactCSSTransitionGroup>
    </>
  );
}
