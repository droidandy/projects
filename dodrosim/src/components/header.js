import React from 'react';
import SC from 'styled-components';
import { Rotate } from 'hamburger-react';
import { useRouter } from 'next/router'
import {HeaderLogo} from './logo';
import {NavLink} from './navLink';
import { maxDevice, minDevice } from '../theme';

const Container = SC.header`
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  filter: drop-shadow(0px 0px 20px rgba(51, 62, 102, 0.1)) drop-shadow(0px 0px 40px rgba(51, 62, 102, 0.05));
`;

const Line1 = SC.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  margin: 0 140px 0 140px;
  @media ${maxDevice.tablet} {
    margin: 0 30px 0 30px;
  }
  @media ${maxDevice.mobileL} {
    margin: 0 30px 0 30px;
  }
`;

const Line2 = SC.div`
  border-top-color: #777777;
  border-top-width: 1px;
  border-top-style: solid;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 1070px) {
    display: none;
  }
  @media ${maxDevice.mobileL} {
    justify-content: flex-start;
    padding-left: 30px;
`;

const List = SC.div`
  @media (max-width: 1070px) {
    display: none;
  }
`;

const Menu = SC.div`
  @media (min-width: 1070px) {
    display: none;
  }
`;

const Content = SC.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media ${minDevice.mobileL} {
    flex-direction: row;
  }
  a:last-child {
    margin: 0;
  }
`;

const menu = [
  { name: 'Услуги', href: '/' },
  { name: 'Объекты', href: '/objects' },
  { name: 'Об учреждении', href: '/about' },
  { name: 'Контакты', href: '/contacts' },
];

export const Header = () => {
  const router = useRouter();
  const [isOpen, setOpen] = React.useState(false);

  const items = React.useMemo(() => {
    return menu.map(i => <NavLink key={i.name} {...i} active={router.route.endsWith(i.href)} onClick={() => setOpen(!isOpen)} />);
  }, [isOpen, router]);

  return (
    <Container>
      <Line1>
        <HeaderLogo />
        <List>
          {items}
        </List>
        <Menu>
          <Rotate color="#333E66" size={24} toggled={isOpen} toggle={setOpen} />
        </Menu>
      </Line1>
      {isOpen && (
        <Line2>
          <Content>
            {items}
          </Content>
        </Line2>
      )}
    </Container>
  );
};
