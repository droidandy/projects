import React from 'react'
import styled from 'styled-components';

interface ProgressBarProps {
  percent: number;
  title?: string;
  showPercent: boolean;
}

const StyledLabel = styled.label`
  position: absolute;
  left: 0px;
  top: 18px;
`;

interface WrapperProps {
  showPercent: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  height: 5px;
  border-radius: 20px;
  background-color: #EDF2FA;
  overflow: hidden;
  position: relative;
  margin-top: 5px;
  margin-left: ${props => props.showPercent ? '30px' : '0px'}
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
const Container = styled.div`
  font-size: 12px;
`;
export default function ProgressBar(props: ProgressBarProps) {
  const { title, percent, showPercent } = props;

  return (
    <Container>
      {title}
      <Wrapper showPercent={showPercent}>
        <ProgressDiv percent={percent}/>
      </Wrapper>
      {showPercent && 
        <StyledLabel>
          {percent + '%'}
        </StyledLabel>
      }
    </Container>
  );
}