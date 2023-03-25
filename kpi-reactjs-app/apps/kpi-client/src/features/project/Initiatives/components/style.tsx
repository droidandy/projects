import styled, { css } from 'styled-components';
import { Col } from 'src/components/Grid';
export const Content = styled.div<{ flex?: boolean }>`
  width: 100%;
  color: #244159;

  ${props =>
    props.flex &&
    css`
      height: 100%;
      display: flex;
      flex-direction: column;
    `}

  @media (min-width: 1025px) {
    padding: 0 30px;
  }

  @media (min-width: 1429px) {
    width: 1380px;
    margin: 0 auto;
  }
`;

export const Container = styled.div`
  background: white;
  border-radius: 3px;
  position: relative;
  margin-top: 30px;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.2);
`;

interface StatusLabelProps {
  color?: string;
}
export const StatusLabel = styled.div<StatusLabelProps>`
  background: ${props => {
    if (props.color && props.color == 'Yellow') {
      return '#f9df18';
    }
    else if (props.color && props.color == 'Green') {
      return '#8EC684';
    }
    else if (props.color && props.color == 'Red') {
      return '#FF3766';
    }
    else {
      return '#FFFFFF';
    }
  }};
  border-radius: 3px;
  color: ${props => {
    if (props.color && props.color == 'Yellow') {
      return 'white';
    }
    else if (props.color && props.color == 'Green') {
      return 'white';
    }
    else if (props.color && props.color == 'Red') {
      return 'white';
    }
    else {
      return 'black';
    }
  }};
  width: 100%;
  height: 26px;
  display: inline-block;
  padding-top: 3px;
`;

interface LabelProps {
  fontSize: string;
  fontWeight?: string;
}
export const Label = styled.label<LabelProps>`
  font-size: ${props => props.fontSize}
  font-weight: ${props => props.fontWeight ? props.fontWeight : 'normal'}
`;

export const CircleLabel = styled.label`
  width: 30px;
  height: 30px;
  margin: 5px;
  border-radius: 15px;
  background: #8EC684;
  display: flex;
  padding-top: 5px;
  padding-right: 9px;
  color: white;
  font-weight: bold;

  ~div {
    width: calc(100% - 30px);
  }
`;

export const Column = styled(Col)`
  display: flex;
  place-items: center;
`;