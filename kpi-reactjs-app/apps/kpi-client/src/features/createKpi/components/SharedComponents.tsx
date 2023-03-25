import styled from 'styled-components';

export const Col = styled.div`
  padding: 0 15px;
  width: 25%;
`;

export const Col3 = styled.div`
  padding: 0 15px;
  width: ${100 / 3}%;
`;

export const ColSpan3 = styled(Col)`
  width: 75%;
`;

export const Row = styled.div`
  display: flex;
  margin: 0 -15px;
  & + & {
    margin-top: 10px;
  }
`;

export const Label = styled.div`
  font-weight: 600;
  display: flex;
  height: 100%;
  line-height: 38px;
  justify-content: flex-end;
  color: #244159;
`;

export const Sep = styled.div`
  background: #ebedf2;
  height: 1px;
  margin-top: 30px;
`;

export const SubSectionTitle = styled.div`
  color: #244159;
  margin: 20px 0 10px;
`;

export const InputWithLabel = styled.div`
  display: flex;
  align-items: center;
  ${Label} {
    margin-left: 10px;
  }
`;

export const IconLabel = styled(Label)`
  line-height: 1.3;
  align-items: center;
  white-space: nowrap;
  svg {
    margin-left: 8px;
  }
`;
