import styled from 'styled-components';
import { Grid } from 'semantic-ui-react';

// Shared
export const Label = styled.div`
  margin-top: 10px;
  margin-bottom: 0px;
  padding-bottom: 0px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  color: #999998;
  letter-spacing: 1px;
  line-height: 1;
`;

// Shared
export const DividedRow = styled(Grid.Row)`
  border-bottom: solid #bbbbbc 1px;
  padding-left: 20px !important;
  padding-right: 20px !important;
`;

// Shared
export const HeaderColumn = styled(Grid.Column)`
  font-size: 12px;
`;

// Shared
export const PremiumStatSmall = styled.div`
  margin-top: 0px;
  padding-top: 0px;
  font-size: 32px;
  color: #666766;
  font-weight: 300;
  line-height: 100%;
  ${(props) => props.align ? `text-align: ${props.align};` : ''}
`;

// Shared
export const Component = styled.div`
    margin-top: 0;
    padding-bottom: 14px;
    margin-bottom: 15px;
    font-size: 12px;
    padding-left: 15px;
    padding-right: 15px;
    font-weight: 600;
    color: #666667;
  `;
