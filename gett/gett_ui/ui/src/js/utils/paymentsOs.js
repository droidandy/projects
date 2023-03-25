import { trim } from 'lodash';

const style = {
  base: {
    secureFields: {
      height: '34px',
    },
    height: '34px',
    marginRight: '5px',
    marginTop: '5px',
    border: '2px solid #ededed',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamilty: 'Roboto',
    lineHeight: '20px',
    padding: '4px',
    cvv: {
      width: '60px',
    },
    pan: {
      width: '165px'
    }
  }
};

export function initSecureFields(elementId, cardNumberPlaceholder, cvvPlaceholder) {
  window.POS.setPublicKey(process.env.PAYMENTS_OS_PUBLIC_KEY);
  window.POS.setEnvironment(process.env.PAYMENTS_OS_ENV);

  setTimeout(function() {
    document.getElementById(elementId).innerHTML = '';
    window.POS.setCardNumberPlaceholder(cardNumberPlaceholder || 'Card Number');
    window.POS.setSecurityNumberPlaceholder(cvvPlaceholder || 'CVV');
    window.POS.setStyle(style);
    window.POS.initSecureFields(elementId);
  });
}

export function createToken(holderName, callback) {
  if (!trim(holderName)) { return callback(); }

  /* eslint-disable */
  window.POS.createToken({ holder_name: holderName }, (result) => {
    const { token } = JSON.parse(result);
    callback(token);
  });
  /* eslint-enable */
}
