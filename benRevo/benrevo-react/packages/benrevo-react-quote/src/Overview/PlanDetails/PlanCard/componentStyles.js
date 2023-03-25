import styled from 'styled-components';
import { Grid, Loader } from 'semantic-ui-react';

export const CardContainer = styled(Grid)`
  width: 100%;
  margin-bottom: 20px !important;
  padding: 20px;
  background-color: #EBEFF1;
  border: #b7c5da solid 1px;
  margin-top: 0px !important;
`;

export const SpacedLoader = styled(Loader)`
  padding-bottom: 65px;
`;

export const DividedColumn = styled(Grid.Column)`
  border-right: solid #b7c5da 1px;
`;
