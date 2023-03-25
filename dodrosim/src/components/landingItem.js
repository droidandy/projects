import React from 'react';
import SC, {css} from 'styled-components';
import { maxDevice } from '../theme';

const Container = SC.div`
  margin: 23px 0;
  @media ${maxDevice.mobileL} {
    margin: 12px 0;
  }
  ${({ face }) => face === 'default'  && css`
    width: 50%;
  `}
  ${({ face }) => face === 'primary'  && css`
    width: auto;
  `}
`;

const Hint = SC.div`
  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  line-height: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #38B662;
`;

const Label = SC.div`
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 38px;
  color: #38B662;
`;

const Text = SC.div`
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: #777777;
`;

export const LandingItem = ({ hint, label, text, face = 'default'}) => {
  return (
    <Container face={face}>
      {hint && (<Hint>{hint}</Hint>)}
      {label && (<Label>{label}</Label>)}
      {text && (<Text>{text}</Text>)}
    </Container>
  );
};
