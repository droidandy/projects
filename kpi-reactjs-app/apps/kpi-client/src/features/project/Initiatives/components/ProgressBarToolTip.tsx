import React, { useState } from 'react'
import styled from 'styled-components';

interface ProgressBarToolTipProps{
  children: React.ReactNode;
  percent: number;
  date: Date[];
}

const Container = styled.div`
  position: absolute;
  left: calc(50% - 280px);
  min-width: 600px;
  bottom: 15px;
  background: #066A99;
  color: white;
  border-radius: 5px;
  padding: 10px 30px;

  &:before, &:after {
    position: absolute;
    content: "";
    display: block;
  }
  
  &:before {
    right: 50%;
    z-index: 2;
    bottom: -10px;
    border-top: 10px solid #066A99;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
  }
  
  &:after {
    right: calc(50% - 1px);
    z-index: 1;
    bottom: -11px;
    border-top: 11px solid #066A99;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
  }
`;
const Wrapper = styled.div`
  margin-left: 40px
  & > :nth-child(3) {
    color: #82B4CC;
    font-size: 12px;
  }
`;
const StyledLabel = styled.label`
  position: absolute;
  left: 30px;
  top: 50px;
  color: white;
`;
const ProgressWrapper = styled.div`
  height: 5px;
  border-radius: 20px;
  background-color: #3586AC;
  overflow: hidden;
  position: relative;
  margin-top: 5px;
`;
interface ProgressDivProps {
  percent: number;
}
const ProgressDiv = styled.div<ProgressDivProps>`
  transform: translateX(${props => (100 - props.percent)}%);
  border-radius: 20px;
  background-color: #22C293;
  transition: transform .4s linear;

  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  position: absolute;
  transition: transform 0.2s linear;
  transform-origin: left;
`;

interface ColProps{
  width?: number;
}
export const Col = styled.div<ColProps>`
  -webkit-box-flex: 0;
  -ms-flex: 0 0 ${props => (props.width ? (100 * props.width / 12.0) : 100)}%;
  flex: 0 0 ${props => (props.width ? (100 * props.width / 12.0) : 100)}%;
  max-width: ${props => (props.width ? (100 * props.width / 12.0) : 100)}%;

  display: ${props => (props.width ? 'grid' : 'flex')};
  place-items: center;
  text-align: center;

  & > :first-child {
    text-align: right;
    place-items: baseline;
  }

  & > :last-child {
    text-align: left;
    place-items: end;
  }
`;

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return (hours % 12 ? hours % 12 : 12) + ':' + (minutes < 10 ? '0' + minutes : minutes);
}
const formatDate = (date: Date) => {
  const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"
  ];
  return monthNames[date.getMonth()] + ' ' + date.getDate();
}

const formatDateTime = (date: Date) => {
  return formatDate(date) + ', ' + formatTime(date);
}

export default function ProgressBarToolTip(props: ProgressBarToolTipProps) {
  const { 
    children,
    percent,
    date
  } = props;

  const [ showTooltip, setShowTooltip ] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
      }}
    >
      {children}
      { showTooltip && 
        <Container>
          <Wrapper>
            <Col>
              <Col width={1.5}>
                {'start'}
              </Col>
              <Col width={3}>
                {'setup'}
              </Col>
              <Col width={3}>
                {'implementation'}
              </Col>
              <Col width={3}>
                {'Post implementation'}
              </Col>
              <Col width={1.5}>
                {'Closed'}
              </Col>
            </Col>
            <ProgressWrapper>
              <ProgressDiv percent={percent}/>
            </ProgressWrapper>
            <Col>
              <Col width={2}>
                {formatDateTime(date[0])}
              </Col>
              <Col width={2}>
                {formatDateTime(date[1])}
              </Col>
              <Col width={4}>
                {formatDateTime(date[2])}
              </Col>
              <Col width={2}>
                {formatDateTime(date[3])}
              </Col>
              <Col width={2}>
                {formatDateTime(date[4])}
              </Col>
            </Col>
          </Wrapper>
          <StyledLabel>
            {percent + '%'}
          </StyledLabel>
        </Container>
      }
    </div>
  );
}