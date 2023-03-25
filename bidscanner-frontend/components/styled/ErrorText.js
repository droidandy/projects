import SmallText from 'components/styled/SmallText';
import { errorColor } from 'context/colors';
import styled from 'styled-components';

const ErrorText = styled(SmallText)`
  color: ${errorColor};
`;

export default ErrorText;
