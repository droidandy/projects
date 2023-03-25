import * as React from 'react';
import styled from 'styled-components';
import { Transition } from 'react-spring/renderprops';
import { MenuIcon } from 'src/icons/MenuIcon';
import { DotsIcon } from 'src/icons/DotsIcon';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MobileHeaderProps {
  className?: string;
}

const Brand = styled.div`
  background-color: #1a1a27;
  justify-content: space-between;
  align-items: center;
  display: flex;
  height: 50px;
  color: white;
  font-size: 18px;
`;

const MenuButton = styled.button<{ active?: boolean }>`
  border: none;
  background: none;
  &:focus {
    outline: none;
  }
  svg {
    width: 28px;
    height: 28px;
  }
  path {
    fill: rgba(255, 255, 255, 0.2);
  }
`;

const MenuButtonDots = styled(MenuButton)`
  svg {
    width: 18px;
    height: 18px;
  }
  ${props =>
    props.active &&
    `
  path {
    fill: #5d78ff;
  }
  `}
  &:focus,
  &:active {
    path {
      fill: #5d78ff;
    }
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
`;

const MainHeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 96;
`;

const SidebarWrapper = styled.div`
  position: fixed;
  width: 255px;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
`;

const Alpha = styled.div`
  background: rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  z-index: 1000;
`;

const _MobileHeader = (props: MobileHeaderProps) => {
  const { className } = props;
  const [isMenuExpanded, setMenuExpanded] = React.useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = React.useState(false);
  return (
    <>
      <div className={className}>
        <Brand>KPI</Brand>
        <Buttons>
          <MenuButton onClick={() => setSidebarExpanded(!isSidebarExpanded)}>
            <MenuIcon />
          </MenuButton>
          <MenuButtonDots onClick={() => setMenuExpanded(!isMenuExpanded)}>
            <DotsIcon />
          </MenuButtonDots>
        </Buttons>
      </div>
      <Transition
        items={isSidebarExpanded}
        config={{ duration: 200 }}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {open =>
          open &&
          (animatedStyle => (
            <Alpha
              style={animatedStyle}
              onClick={() => setSidebarExpanded(false)}
            />
          ))
        }
      </Transition>
      <Transition
        items={isMenuExpanded}
        config={{ duration: 200 }}
        from={{ top: 0 }}
        enter={{ top: 50 }}
        leave={{ top: 0 }}
      >
        {open =>
          open &&
          (animatedStyle => (
            <MainHeaderWrapper style={animatedStyle}>
              <Header mobile />
            </MainHeaderWrapper>
          ))
        }
      </Transition>
      <Transition
        items={isSidebarExpanded}
        config={{ duration: 150 }}
        from={{ right: -255 }}
        enter={{ right: 0 }}
        leave={{ right: -255 }}
      >
        {open =>
          open &&
          (animatedStyle => (
            <SidebarWrapper style={animatedStyle}>
              <Sidebar mobile onClose={() => setSidebarExpanded(false)} />
            </SidebarWrapper>
          ))
        }
      </Transition>
    </>
  );
};

export const MobileHeader = styled(_MobileHeader)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 97;
  display: flex;
  background-color: #1a1a27;
  justify-content: space-between;
  padding: 0 15px;
  height: 50px;
`;
