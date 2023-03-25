import React from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/Button'
import { ArrowIcon } from 'src/components/ArrowIcon';

export const Content = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;

  font-style: normal;
  font-size: 14px;
  color: #244159;
`;

export const Form = styled.form`
  width: 75%;
`;

export const Header = styled.div`
  padding-top: 36px;
  padding-bottom: 50px;
  padding-right: 230px;
  font-weight: bold;
  font-size: 16px;
  text-align: right;
  color: #464457;
`;

export const RightHeader = styled(Header)`
  padding: 15px 0px;
  font-size: 20px;
`;

export const SubRightHeader = styled(RightHeader)`
  margin-top: 40px;
  font-size: 16px;
  direction: ltr;
`;

export const Footer = styled.div`
  padding-top: 20px;
  padding-bottom: 64px;
  font-weight: bold;
  font-size: 16px;
  text-align: right;
  color: #464457;
  display: flex;
  border-top: 1px solid #EBEDF2;

  margin-left: -198px;
  margin-right: -198px;
  padding-left: 198px;
  padding-right: 428px;
`;

export const Body= styled.div`
  display: flex;
  flex-flow: wrap;
  padding-bottom: 20px;
`;

export const Label = styled.div`
  width: 220px;
  padding-left: 10px;
  text-align: left;
`;

export const Inputs = styled.div`
  width: calc(100% - 220px);
  padding-right: 10px;
  margin-bottom: 20px;
`;

interface IconButtonProps {
  width?: string;
  height?: string;
  fontSize?: string;
}
export const IconButton = styled(Button)<IconButtonProps>`
  min-width: 60px;
  width: ${props => props.width ? props.width : '86px'};
  height: ${props => props.height ? props.height : '30px'};
  justify-content: space-evenly;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 0px;
  font-size: ${props => props.fontSize ? props.fontSize : ''};
  font-weight: bold;
  &:nth-child(n+2) {
    margin-right: 10px;
    margin-left: 10px;
  }
`;

export const Comment = styled.div`
  font-size: 13px;
  color: #595D6E;
`;

interface ColProps{
  width?: number;
  direction?: string;
}

export const Col = styled.div<ColProps>`
  -webkit-box-flex: 0;
  -ms-flex: 0 0 ${props => (props.width ? (100 * props.width / 12.0) : 100)}%;
  flex: 0 0 ${props => (props.width ? (100 * props.width / 12.0) : 100)}%;
  max-width: ${props => (props.width ? (100 * props.width / 12.0) : 100)}%;

  display: flex;
  padding-bottom: 7px;
  padding-top: 7px;
  direction: ${props => (props.direction ? props.direction : '')}
`;

export const TableContent = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;

  font-style: normal;
  font-size: 14px;
  color: #244159;
`;

export const TableHeader = styled.div`
  display: flex;
  place-items: center;
  padding: 0px 30px;
  height: 60px;
  text-align: right;
  color: white;
  background: #066A99;
  font-weight: bold;
  border-radius: 3px;
  font-size: 16px;
`;

export const TableSubHeader = styled(TableHeader)`
  color: #244159;
  background: #EDF2FA;
  cursor: pointer;
  margin-top: 5px;
`;

export const TableFooter = styled.div`
  padding: 20px 30px 30px 30px;
  font-weight: bold;
  font-size: 16px;
  text-align: right;
  color: #464457;
  display: flex;
  border-top: 1px solid #EBEDF2;
`;

export const TableBody= styled.div`
  display: flex;
  flex-flow: wrap;
  padding: 40px 30px;
`;

export const TableForm = styled.form`
  width: 100%;
`;

export const AddFieldButton = styled(IconButton)`
  width: 180px;
`;

const ArrowWrapper = styled.div`
  margin-right: 10px;
`;

interface _ArrowIconProps {
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const SingleArrowIcon = (props: _ArrowIconProps) => {
  return (
    <ArrowWrapper>
      <ArrowIcon color="#244159" direction={props.direction} />
    </ArrowWrapper>
  )
}

interface StateLabelProps {
  state?: number;
}
export const StateLabel = styled.div<StateLabelProps>`
  background: ${props => {
    if (!props.state || props.state <= 10) {
      return '#8EC684';
    }
    else if (!props.state || props.state <= 20) {
      return '#FFE019';
    }
    else {
      return '#FF3766';
    }
  }};
  border-radius: 3px;
  color: white;
  width: 56px;
  height: 26px;
  display: inline-block;
  padding-top: 3px;
`;
