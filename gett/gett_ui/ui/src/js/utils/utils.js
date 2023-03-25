import faye from './faye';
import { isEmpty, isEqual, isPlainObject, find } from 'lodash';
import DownloadHelper from 'utils/DownloadHelper';
import { vehiclesOrder } from 'pages/shared/bookings/data';
import countryData from 'country-telephone-data';

const defaultUrlForOptions = { statics: false };
const { allCountries } = countryData;

export function affixTarget() {
  return document.querySelector('#scrollContainer');
}

export function urlFor(path, options = {}) {
  const { statics } = Object.assign({}, defaultUrlForOptions, options);
  let url = path;

  if (__DEV__ && statics) {
    url = process.env.RAILS_HOST + path;
  }

  return url;
}

urlFor.statics = function(path, opts = {}) {
  return urlFor(path, { ...opts, statics: true });
};

urlFor.download = function(path, opts = {}) {
  return function() {
    new DownloadHelper(urlFor(path, opts)).post();
  };
};

urlFor.download.statics = function(path, opts = {}) {
  return urlFor.download(path, { ...opts, statics: true });
};

export function isBbcCompanyType(companyType) {
  return companyType === 'bbc';
}

// converts price amount in cents/pennies/etc to dollars/pounds/etc
export function decimalize(amount, round = 2) {
  return (amount / 100).toFixed(round);
}

function stripPhoneNumber(phoneNumber) {
  return phoneNumber && phoneNumber.replace(/\D/g, '') || '';
}

export function getCountryByPhoneNumber(phoneNumber, priority = 0) {
  const digits = stripPhoneNumber(phoneNumber);

  return find(allCountries, c => (
    digits.startsWith(c.dialCode) && (c.priority === priority) && c.format
  ));
}

export function formatPhoneNumber(value, defaultFormatCountryCode = 'gb') {
  const digits = stripPhoneNumber(value);
  const country = getCountryByPhoneNumber(value) || find(allCountries, { iso2: defaultFormatCountryCode });
  const format = country.format + '.....';

  let index = 0;

  return value && format && '+' + format.slice(1).replace(/./g, (char) => {
    if (index >= digits.length) return '';
    if (char === '.') return digits[index++];
    return char;
  });
}

// helper method with completely invalid name (since it doesn't perform any
// currency conversion) used to render prices for any currency. at the moment
// of writing the only currency rendered is 'Pound', and this fact is hardcoded
// in method name (sick).
export function centsToPounds(price) {
  return decimalize(price);
}

Object.defineProperty(urlFor, 'downloadProps', {
  get: function() {
    const props = { download: true };

    // in IE have to open download link in separate window, since IE does not
    // support 'download' attribute, and opening link in the same window breaks
    // file upload for some reason.
    if (navigator.msSaveBlob) {
      props.target = '_blank';
    }

    return props;
  }
});

export function stopPropagation(e) {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
}

export function withoutPropagation(fn, ...args) {
  return function(e) {
    stopPropagation(e);
    return fn(...args);
  };
}

export function subscribe(channelProp, handlerName) {
  if (isPlainObject(channelProp)) {
    return fayeSubscribe(channelProp);
  }
  if (handlerName && channelProp) {
    return fayeSubscribe({ [channelProp]: handlerName });
  }
}

export function strFilter(string, filter) {
  if (isEmpty(filter)) {
    return true;
  }
  return string.toLowerCase().includes(filter.toLowerCase());
}

export function vehiclesChartItemSorter(a, b) {
  return vehiclesOrder[a.dataKey] - vehiclesOrder[b.dataKey];
}

function fayeSubscribe(setup) {
  return function(Component) {
    function subscribe(channel, handlerName) {
      this.fayeSubscriptions[channel] = faye.on(channel, (message) => {
        this[handlerName](message.data);
      });
    }

    return class extends Component {
      static displayName = `Subscribe(${Component.displayName || Component.name})`;

      componentDidMount() {
        if (super.componentDidMount) super.componentDidMount(...arguments);

        for (const channelProp in setup) {
          if (this.props[channelProp]) {
            subscribe.call(this, this.props[channelProp], setup[channelProp]);
          }
        }
      }

      componentDidUpdate(prevProps) {
        if (super.componentDidUpdate) super.componentDidUpdate(...arguments);

        if (!isEqual(prevProps, this.props)) {
          for (const channelProp in setup) {
            if (!this.fayeSubscriptions[this.props[channelProp]] && this.props[channelProp]) {
              subscribe.call(this, this.props[channelProp], setup[channelProp]);
            }
          }
        }
      }

      componentWillUnmount() {
        if (super.componentWillUnmount) super.componentWillUnmount(...arguments);

        for (const key in this.fayeSubscriptions) {
          this.fayeSubscriptions[key].cancel();
        }
      }

      fayeSubscriptions = {};
    };
  };
}
