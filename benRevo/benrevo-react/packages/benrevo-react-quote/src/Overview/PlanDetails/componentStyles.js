import styled from 'styled-components';
import { Grid } from 'semantic-ui-react';

export const Container = styled.div`
  margin-top: 35px;
  border-top: solid #dddddd 1px;
  padding-left: 30px;
`;

export const PresentationHeader = styled.div`
  margin-top: 20px;
  display: inline;
  font-weight: 300;
  font-size: 36px;
  float: left;
`;

export const HeaderDivider = styled(Grid.Column)`
  position: relative;
  &:before {
    content: '';
    position: absolute;
    border-bottom: solid #aaaaaa 1px;
    transform: translateY(-50%);
    left: 0;
    right: 0;
  }
`;
