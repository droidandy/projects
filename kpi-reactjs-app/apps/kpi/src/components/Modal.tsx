import React from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { rtlMargin } from 'shared/rtl';

interface ModalProps {
  title?: React.ReactNode;
  transparent?: boolean;
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
  size?: 'lg' | 'md';
  maxHeight?: string;
  minHeight?: string;
  height?: string | number;
  side?: boolean;
}

const GlobalStyle = createGlobalStyle`
.modal-enter {
  opacity: 0.01;
}

.modal-enter.modal-enter-active {
  opacity: 1;
  transition: opacity 150ms ease-in-out;
}

.modal-leave {
  opacity: 1;
}

.modal-leave.modal-leave-active {
  opacity: 0.01;
  transition: opacity 150ms ease-in-out;
}

.modal-open {
  overflow: hidden
}

`;

const ModalContent = styled.div`
  width: 80vw;
  background: white;
  border-radius: 4px;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: 1px solid #ebedf2;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const ModalBody = styled.div`
  max-height: 80vh;
  overflow: auto;
  transition: max-height 0.2s ease-in-out;
  padding: 1.25rem;
  pre[class*='language-'] {
    margin: 0;
    max-height: 80vh;
    overflow: auto;
  }
`;
const ModalTitle = styled.h5`
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
  right: -20px;
  top: -20px;
  z-index: 10;
  opacity: 1;
  color: white;
  text-shadow: 0 1px 0 #000;
`;

const Wrapper = styled.div<{ side?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  padding: 30px;
  ${props =>
    props.side &&
    css`
      padding: 0;
      justify-content: flex-end;
      ${ModalContent} {
        height: 100%;
        width: 400px;
      }
      ${ModalContent},
      ${ModalHeader} {
        border-radius: 0;
      }
    `}
`;

export function Modal(props: ModalProps) {
  const {
    isOpen,
    close,
    children,
    title,
    transparent,
    size,
    maxHeight,
    minHeight,
    height,
    side,
  } = props;
  React.useEffect(() => {
    if (!isOpen) {
      return () => {
        //
      };
    }
    document.body.classList.add('modal-open');
    const onKeyPress = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keyup', onKeyPress);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keyup', onKeyPress);
    };
  }, [isOpen]);
  return (
    <>
      <GlobalStyle />
      <ReactCSSTransitionGroup
        transitionName="modal"
        transitionEnterTimeout={150}
        transitionLeaveTimeout={150}
      >
        {isOpen && (
          <Wrapper
            data-modal-wrapper
            onClick={e => {
              const target = e.target as HTMLDivElement;
              if (target.hasAttribute('data-modal-wrapper')) {
                close();
              }
            }}
            side={side}
          >
            <ModalContent
              style={{
                background: transparent ? 'transparent' : 'white',
                maxWidth: size === 'md' ? 700 : undefined,
              }}
            >
              {title ? (
                <ModalHeader>
                  {<ModalTitle>{title}</ModalTitle>}
                  <Close onClick={close}>×</Close>
                </ModalHeader>
              ) : (
                <AbsoluteClose onClick={close}>×</AbsoluteClose>
              )}
              <ModalBody
                style={{
                  maxHeight,
                  minHeight,
                  height,
                }}
              >
                {children}
              </ModalBody>
            </ModalContent>
          </Wrapper>
        )}
      </ReactCSSTransitionGroup>
    </>
  );
}
