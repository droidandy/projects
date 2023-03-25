import styled from 'styled-components';

const AvatarPlaceholder = styled.div`
  width: ${props => props.size || '100px'};
  height: ${props => props.size || '100px'};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  font-size: 300%;
`;

export default ({ firstName, lastName, size }) => (
  <AvatarPlaceholder size={size}>
    {firstName[0]}
    {lastName[0]}
  </AvatarPlaceholder>
);
