import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { CloseIcon } from 'src/icons/CloseIcon';

interface ModalProps {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  buttons?: React.ReactNode;
  transparent?: boolean;
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
  size?: 'lg' | 'md' | 'sm';
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
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);
  padding-top: 30px;
`;

const ModalBody = styled.div`
  max-height: 80vh;
  overflow: auto;
  transition: max-height 0.2s ease-in-out;
  pre[class*='language-'] {
    margin: 0;
    max-height: 80vh;
    overflow: auto;
  }
`;
const ModalTitle = styled.h5`
  margin: 0;
  color: #464457;
  font-weight: bold;
  color: #244159;
  font-size: 18px;
  line-height: 23px;
  padding: 0 30px;
`;

const ModalSubTitle = styled.h5`
  margin: 0;
  color: #a7abc3;
  padding: 0 30px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  margin-top: 9px;
`;

const AbsoluteClose = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  opacity: 1;

  &:hover {
    opacity: 0.75;
    cursor: pointer;
  }
`;

const Buttons = styled.div`
  border-top: 1px solid #ebedf2;
  padding: 25px 30px 30px;
  display: flex;
  > * + * {
    margin-right: 10px;
  }
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
`;

export function Modal(props: ModalProps) {
  const {
    isOpen,
    close,
    children,
    title,
    subTitle,
    transparent,
    size,
    maxHeight,
    minHeight,
    height,
    side,
    buttons,
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
                maxWidth: size === 'sm' ? 500 : size === 'md' ? 700 : undefined,
              }}
            >
              <AbsoluteClose onClick={close}>
                <CloseIcon />
              </AbsoluteClose>
              {title && <ModalTitle>{title}</ModalTitle>}
              {subTitle && <ModalSubTitle>{subTitle}</ModalSubTitle>}
              <ModalBody
                style={{
                  maxHeight,
                  minHeight,
                  height,
                }}
              >
                {children}
              </ModalBody>
              <Buttons>{buttons}</Buttons>
            </ModalContent>
          </Wrapper>
        )}
      </ReactCSSTransitionGroup>
    </>
  );
}
