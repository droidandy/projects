import Scroller from 'react-scroll';
const scroll = Scroller.animateScroll;
/**
 * @param scope - the component wishing to set state. note: possibly use bind patterns here so scope doens't have to be passed;
 * @param {array} validators - an array of validator objects
* */
export function isFormValid(scope, validators) {
  const allFieldsValid = [];
  const errObj = {};
  if (validators && Array.isArray(validators)) {
    validators.forEach((item) => {
      if (item && item.name && typeof item.isValid === 'function') {
        const isValid = item.isValid();
        allFieldsValid.push(isValid);
        errObj[item.name] = !isValid;
      }
    });
  } else {
    throw new Error('please pass a valid array of validator objects');
  }

  scope.setState({ formErrors: errObj });
  return !(allFieldsValid.includes(false));
}

export function extractFloat(string) {
  const regex = /[+-]?\d+(\.\d+)?/g;
  const value = string !== null && string !== undefined ? string.toString() : '';
  const matched = value.match(regex);

  if (!matched) return [null];

  return matched.map((v) => parseFloat(v));
}

export function scrollToInvalid(elems, position, domElem, containerId) {
  let options = null;
  if (containerId) {
    options = {
      containerId,
    };
  }
  if (position) {
    scroll.scrollTo(position, options);
    return true;
  }
  if (elems && elems.length > 0) {
    let offset = null;
    elems.map((elem) => {
      const el = [...document.getElementsByName(elem)] || [domElem];

      if (el.length) {
        for (let i = 0; i < el.length; i += 1) {
          const item = el[i];
          if (!item.classList.contains('error-flash')) {
            item.classList.add('error-flash');

            setTimeout(() => {
              item.classList.remove('error-flash');
            }, 5000);

            const bodyRect = document.body.getBoundingClientRect();
            let elemRect = item.getBoundingClientRect();
            if (elemRect.top === 0) {
              elemRect = item.nextSibling.getBoundingClientRect();
            }

            let top = elemRect.top - bodyRect.top;

            if (top <= 100 && top >= 0) top = 0;
            else if (top > 100) top -= 100;

            if (offset === null || top < offset) offset = top;
          }
        }
      }

      return true;
    });

    if (offset) {
      scroll.scrollTo(offset, options);
    }
  }

  return true;
}

export function downloadFile(data, ext, type, fileName = '') {
  let filename = data.filename;
  if (!filename) filename = `${fileName}.${ext}`;

  const blob = new Blob([data], {
    type,
  });
  const link = document.createElement('a');

  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute('download', filename);
    if (document.createEvent) {
      const event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      link.dispatchEvent(event);
    } else {
      link.click();
    }
  }
}
