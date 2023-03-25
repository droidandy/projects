import AnthemImg from './../../../assets/img/svg/anthem_logo.svg';
import AnthemCVImg from './../../../assets/img/svg/clear_value_logo.svg';
import AnthemKaiserImg from './../../../assets/img/svg/anthem-kaiser.svg';
import UHCKaiserImg from './../../../assets/img/svg/uhc-kaiser.svg';
import UHCImg from './../../../assets/img/svg/uhc_logo.svg';

export function getLogo(carrier, quoteType) {
  let img = null;

  if (quoteType === 'KAISER' && carrier === 'Anthem Blue Cross') img = AnthemKaiserImg;
  else if (quoteType === 'KAISER' && carrier === 'UnitedHealthcare') img = UHCKaiserImg;
  else if (carrier === 'Anthem Clear Value') img = AnthemCVImg;
  else if (carrier === 'Anthem Blue Cross') img = AnthemImg;
  else if (carrier === 'UnitedHealthcare') img = UHCImg;

  return img;
}

export function getClass(carrier, quoteType) {
  let className = null;

  if (quoteType === 'KAISER' && carrier === 'Anthem Blue Cross') className = 'anthem-kaiser';
  else if (quoteType === 'KAISER' && carrier === 'UnitedHealthcare') className = 'uhc-kaiser';
  else if (carrier === 'Anthem Clear Value') className = 'cv';
  else if (carrier === 'Anthem Blue Cross') className = 'anthem';
  else if (carrier === 'UnitedHealthcare') className = 'uhc';

  return className;
}
