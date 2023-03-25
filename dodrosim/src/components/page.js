import React from 'react';
import SC from 'styled-components';
import { maxDevice, minDevice } from '../theme';
import { AnchoredLayout } from './anchoredLayout';
import { Footer } from "./footer";

const Container = SC.header`
  display: flex;
  margin: 120px 140px 60px 140px;
  @media ${maxDevice.tablet} {
    margin: 120px 30px 60px 30px;
  }
  @media ${maxDevice.mobileL} {
    margin: 90px 30px 50px 30px;
  }
  @media ${maxDevice.laptopL} {
    flex-direction: column;
  }
`;

const Header = SC.div`
  white-space: pre-line;
  font-style: normal;
  font-weight: normal;
  font-size: 40px;
  line-height: 48px;
  color: #000000;
  margin-bottom: 40px;
  @media ${maxDevice.mobileL} {
    margin-bottom: 30px;
    font-size: 30px;
    line-height: 36px;
  }
`;

const Text = SC.div`
  white-space: pre-line;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #777777;
  max-width: 760px;
`;
const LeftSide = SC.div`
  width: 100%;
`;
const Layout = SC.div`
  @media ${minDevice.laptopL} {
    display: none;
  }
`;

const RightSide = SC.div`
  margin: 0 0 0 400px;
  @media ${maxDevice.laptopL} {
    display: none;
  }
`;

export const Page = ({label, text, children, ancors, withFooter = true, withRight = true}) => {
  return (
    <>
      <Container>
        <LeftSide>
          {label && (<Header>{label}</Header>)}
          <Layout>
            <AnchoredLayout ancors={ancors} />
          </Layout>
          {text && (<Text>{text}</Text>)}
          {children}
        </LeftSide>
        {withRight && (
          <RightSide>
            <AnchoredLayout ancors={ancors} />
          </RightSide>
        )}
      </Container>
      {withFooter && <Footer />}
    </>
  );
};
