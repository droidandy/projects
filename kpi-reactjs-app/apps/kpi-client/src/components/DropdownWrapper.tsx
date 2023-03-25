import styled from 'styled-components';

export const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-shadow: 0px 0px 50px 0px rgba(82, 63, 105, 0.15);
  padding: 20px 0;
  border-radius: 4px;

  && {
    a {
      width: 100%;
      padding: 11px 30px;
      align-items: center;
      display: flex;
      transition: all 0.3s;
      font-weight: 500;
      color: #595d6e;
      background-color: white;
      &:hover {
        cursor: pointer;
        color: #374afb;
        text-decoration: none;
        background-color: #f7f8fa;
      }
    }
  }
`;
