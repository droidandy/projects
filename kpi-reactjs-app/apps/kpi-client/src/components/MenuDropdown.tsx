import React from 'react';
import styled from 'styled-components';
import * as PopperJS from 'popper.js';
import { Manager, Reference, Popper } from 'react-popper';
import { Transition } from 'react-spring/renderprops';
import { TopBarItem } from './TopBar';

const DropdownWrapper = styled.div`
  box-shadow: 0px 0px 50px 0px rgba(82, 63, 105, 0.15);
  border-radius: 4px;
  background-color: #fff;
  color: #212529;
  text-align: left;
  z-index: 100;
`;

interface MenuDropdownProps {
  children: React.ReactNode;
  dropdown: React.ReactNode;
  placement?: PopperJS.Placement;
  width?: string;
}

// function checkToggle(e: HTMLElement | null): boolean {
//   if (!e) {
//     return false;
//   }
//   if (e.getAttribute('data-dropdown-toggle')) {
//     return true;
//   }
//   return checkToggle(e.parentElement);
// }

function isClickable(node: HTMLElement | null): boolean {
  if (!node) {
    return false;
  }
  if (node.tagName === 'A' || node.tagName === 'BUTTON') {
    return true;
  }
  return isClickable(node.parentElement);
}

export function MenuDropdown(props: MenuDropdownProps) {
  const { children, dropdown, placement, width } = props;
  const [isOpen, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onClick = () => {
      setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [isOpen]);
  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <TopBarItem
            data-dropdown-toggle
            ref={ref}
            onClick={() => {
              setOpen(!isOpen);
            }}
          >
            {children}
          </TopBarItem>
        )}
      </Reference>
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
            <Popper placement={placement || 'bottom-start'}>
              {({ ref, style, placement: _placement, arrowProps }) => (
                <DropdownWrapper
                  ref={ref}
                  style={{ ...style, ...(open ? animatedStyle : {}), width: width ? width : '' }}
                  data-placement={_placement}
                  onClick={e => {
                    if (isClickable(e.target as any)) {
                      return;
                    }
                    e.nativeEvent.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                >
                  {dropdown}
                </DropdownWrapper>
              )}
            </Popper>
          ))
        }
      </Transition>
    </Manager>
  );
}
