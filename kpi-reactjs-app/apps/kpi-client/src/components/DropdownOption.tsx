import styled from 'styled-components';

export const DropdownOption = styled.a`
  width: 100%;
  margin: 0.25rem 0;
  padding: 0.55rem 1.75rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  align-items: center;
  display: flex;
  transition: all 0.3s;
  font-weight: 500;
  color: #595d6e;
  &:hover {
    cursor: pointer;
    color: #5d78ff;
    text-decoration: none;
    background-color: #f7f8fa;
  }
`;
