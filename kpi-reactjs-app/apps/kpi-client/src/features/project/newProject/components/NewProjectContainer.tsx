import React from 'react';
import styled from 'styled-components';

interface NewProjectContainerProps {
  children: React.ReactNode;
}

const Content = styled.div`
  width: 100%;
  padding-left: 135px;
  padding-right: 135px;
  padding-top: 30px;
  padding-bottom: 30px;
`;

const Container = styled.div`
  background: white;
  border-radius: 3px;
  position: relative;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.2);
`;

export const NewProjectContainer = (props: NewProjectContainerProps) => {
  const {children} = props;
  return (
    <Content>
      <Container>
        {children}
      </Container>
    </Content>
  )

};