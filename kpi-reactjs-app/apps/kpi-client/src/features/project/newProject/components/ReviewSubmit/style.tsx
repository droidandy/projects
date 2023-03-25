import styled from 'styled-components';
import { 
  IconButton,
  Label,
} from '../../../common/style';

export const EditButton = styled(IconButton)`
  margin-right: 10px;
  width: 70px;
  height: 30px;
`;

export const RightLabel = styled(Label)`
  text-align: right;
  width: 230px;
`;

export const LeftLabel = styled(Label)`
  text-align: right;
  width: calc(55% - 230px);
  min-wdith: 400px;
  & > * {
    margin: 0px;
  }
`;