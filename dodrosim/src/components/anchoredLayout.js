import React from "react";
import SC, {css} from 'styled-components';
import Link from "next/link";
import { useRouter } from 'next/router';
import { minDevice } from '../theme';

const Container = SC.div`
  margin: 0 0 60px 0;
  background: #F2F4FA;
  border-radius: 3px;
  padding: 30px;
  @media ${minDevice.laptopL} {
    width: 360px;
    position: fixed;
    right: 40px;
  }
`;

const Item = SC.a`
  margin: 16px 0;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #008E5B;
  &:hover {
    color: #333E66;
  }
  ${({ active }) => active  && css`
    color: #333E66;
  `}
`;

export const AnchoredLayout = ({ ancors }) => {
  const router = useRouter();
  return ancors ? (
    <Container>
      {(ancors || []).map(i => (
        <Link key={i.name} href={i.href} passHref>
          <Item key={i.name} active={router.asPath.endsWith(i.href)}>{i.name}</Item>
        </Link>
      ))}
    </Container>
  ) : null;
}

