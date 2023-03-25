import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

export const CustomTooltip = styled(ReactTooltip)`
  color: #ffffff !important;
  background-color: #384ad7 !important;

  :after {
    border-bottom-color: #384ad7 !important;
  }
`;
