import React from 'react';
import styled from 'styled-components';
import { TableRow } from '../../../common/Table';
import { 
  IconButton,
  Label,
} from '../../../common/style';

export const RightLabel = styled(Label)`
  text-align: right;
  width: 230px;
`;

export const LeftLabel = styled(Label)`
  text-align: right;
  width: calc(70% - 230px);
  min-wdith: 400px;
  & > * {
    margin: 0px;
  }
`;

export const ReviewTableBody = styled.div`
  display: flex;
  flex-flow: wrap;
  padding: 20px 105px;
`;

const Wrapper = styled.div`
  margin-top: 20px;
  width: 100%;
`;
interface ReviewTableTitleProps {
  title: string;
}
export const ReviewTableTitle = (props: ReviewTableTitleProps) => {
  return (
    <Wrapper>
      <TableRow 
        background="#F4F7FA"
        fontWeight="bold"
        height="46px"
        headers={
          [
            {
              value: props.title,
              align: 'right',
              width: '100%',
              padding: '0px'
            }
          ]
        }
      />
    </Wrapper>
  )
}

export const TableFooter = styled.div`
  padding: 20px 105px 30px 105px;
  font-weight: bold;
  font-size: 14px;
  text-align: right;
  color: #464457;
  display: flex;
  border-top: 1px solid #EBEDF2;
`;
