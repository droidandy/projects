import React from 'react';
import styled from 'styled-components';
import { Transition } from 'react-spring/renderprops';
import { Manager, Reference, Popper } from 'react-popper';
import { Trans } from 'react-i18next';
import { Button } from './Button';
import { rtlMargin } from 'shared/rtl';
import ReactDOM from 'react-dom';

interface PopconfirmProps {
  children: React.ReactElement;
  text: string;
  onYes: () => any;
  onNo?: () => any;
}

const PopupWrapper = styled.div`
  && {
    margin: 0;
    margin-bottom: 10px;
  }
  background-color: #fff;
  background-clip: padding-box;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  z-index: 10000;
`;

const AlertText = styled.div`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  svg {
    margin: 0 10px;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  button + button {
    ${rtlMargin('10px', 0)}
  }
`;

const Arrow = styled.div`
  background: #fff;
  transform: translateX(-50%) rotate(45deg);
  display: block;
  border-color: transparent;
  border-style: solid;
  width: 8px;
  height: 8px;
  bottom: -4px;
  position: absolute;
`;

export function Popconfirm(props: PopconfirmProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { children, text, onYes, onNo } = props;

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onClick = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [isOpen]);

  return (
    <Manager>
      <Reference>
        {({ ref }) =>
          React.cloneElement(children, {
            onClick: () => {
              setIsOpen(true);
            },
            innerRef: ref,
          })
        }
      </Reference>
      {ReactDOM.createPortal(
        <Transition
          items={isOpen}
          config={(item, state) =>
            state === 'leave' ? { duration: 0 } : { duration: 200 }
          }
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {open =>
            open &&
            (animatedStyle => (
              <Popper placement="top">
                {({ ref, style, arrowProps }) => (
                  <PopupWrapper
                    ref={ref}
                    style={{ ...style, ...(open ? animatedStyle : {}) }}
                  >
                    <Arrow {...arrowProps} />
                    <AlertText>
                      <svg viewBox="64 64 896 896" width="1em" height="1em">
                        <path
                          fill="orange"
                          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"
                        ></path>
                      </svg>
                      <Trans>{text}</Trans>
                    </AlertText>
                    <Buttons>
                      <Button onClick={onNo} small styling="brand">
                        <Trans>No</Trans>
                      </Button>
                      <Button onClick={onYes} small>
                        <Trans>Yes</Trans>
                      </Button>
                    </Buttons>
                  </PopupWrapper>
                )}
              </Popper>
            ))
          }
        </Transition>,
        document.querySelector('#portals')!
      )}
    </Manager>
  );
}
