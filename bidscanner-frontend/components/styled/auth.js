import styled from 'styled-components';
import StyledLink from 'components/styled/StyledLink';
import Dialog from 'material-ui/Dialog';

export const Title = styled.div`
  font-size: 18px;
  color: black;
  margin-bottom: 20px;
  @media (max-width: 500px) {
    display: ${props => (props.showForSmall ? 'inline' : 'none')};
  }
`;

export const MinorTitle = styled.div`
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 5px;
  color: black;
  @media (max-width: 500px) {
    margin-top: 5px;
  }
`;

export const BottomText = styled.div`
  align-text: center;
  font-size: 14px;
  margin-top: 50px;
  color: black;
  & > u {
    text-decoration: underline;
  }
  @media (max-width: 500px) {
    margin-top: 10px;
  }
`;

export const Close = styled.div`
  position: absolute;
  right: -50px;
  top: -5px;
  color: white;
  cursor: pointer;
  @media (max-width: 500px) {
    right: 15px;
    top: -30px;
  }
  @media (max-width: 350px) {
    right: 25px;
    top: -30px;
  }
  @media (max-width: 350px) {
    right: 20px;
    top: -30px;
  }
`;

export const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || 'white'};
  width: 100%;
  height: 36px;
  border: ${props => (props.noBroder ? 'none' : '1px solid #e4e4e4')};
  border-radius: 4px;
  font-size: 24px;
  font-weight: bold;
  background-color: ${props => props.backgroundColor || 'white'};
  margin-top: 5px;
  overflow: hidden;

  & > span.icon {
    margin-right: 10px;
  }
`;

export const SmallText = styled.div`
  margin-top: 20px;
  font-size: 12px;
  color: #bcbec0;
  text-align: center;
  @media (max-width: 500px) {
    margin-top: 5px;
  }
`;

export const StyledDialog = styled(Dialog).attrs({
  style: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  paperProps: {
    style: { borderRadius: '8px', width: 'calc(100% - 3em)', marginLeft: '1.5em' },
  },
  contentStyle: {
    width: '100%',
    minWidth: '360px',
  },
})``;

export const Terms = StyledLink.extend`
  text-decoration: underline;

  & > a {
    color: #bcbec0;
  }
`;

export const Button = styled.button`
  background-color: black;
  color: white;
  width: 100%;
  border: none;
  border-radius: 4px;
  font-size: 24px;
  font-weight: bold;
  margin-top: 5px;
  @media (max-width: 500px) {
    font-size: 16px;
    font-weight: normal;
  }
`;

export const SwitchButton = styled.button`
  border: none;
  background-color: white;
  text-decoration: underline;
  cursor: pointer;
`;
