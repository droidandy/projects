import styled from 'styled-components';
import { Grid } from 'semantic-ui-react';

export const Banner = styled(Grid.Column)`
  border-top: solid #32c0c4 1px;
  border-bottom: solid #32c0c4 1px;
  padding: 15px;
  text-align: center;
  font-size: 12pt;
`;

export const SaveImage = styled.div`
  margin-top: -15px;
  padding-left: 20px;
  float: left
  img {
    width: 300px;
  }
`;

export const Heavy = styled.span`
  font-weight: 600;
`;
