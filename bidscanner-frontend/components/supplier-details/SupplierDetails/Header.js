// @flow
import styled from 'styled-components';

const profileImageSize = '8em';
const ProfileImage = styled.img`
  width: ${profileImageSize};
  height: ${profileImageSize};
  position: relative;
  border: 1px solid white;
  top: calc(${profileImageSize} / 2);
  left: calc(${profileImageSize});
  @media (max-width: 1200px) {
    left: calc(${profileImageSize} / 2);
  }
`;

const Container = styled.div`
  display: flex;
  padding-top: 2em;
  flex-direction: column;
  background-image: url(${props => props.background});
  @media (max-width: 1024px) {
    margin-bottom: calc(${profileImageSize} / 2);
  }
`;

export type HeaderProps = {
  backgroundImage: string,
  profileImage: string,
};

export default ({ backgroundImage, profileImage }: HeaderProps) => (
  <Container background={backgroundImage}>
    <ProfileImage src={profileImage} />
  </Container>
);
