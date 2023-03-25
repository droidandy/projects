import auth from './auth';
import faye from './faye';
import { isEmpty, isPlainObject } from 'lodash';

const defaultUrlForOptions = {
  tokenized: false,
  statics: false
};

export function urlFor(path, options = {}) {
  const { tokenized, statics } = Object.assign({}, defaultUrlForOptions, options);
  let url = path;

  if (__DEV__ && statics) {
    url = process.env.RAILS_HOST + path;
  }
  if (tokenized) {
    url = url + (url.includes('?') ? '&' : '?') + `token=${auth.getToken()}`;
  }

  return url;
}

urlFor.tokenized = function(path, opts = {}) {
  return urlFor(path, { ...opts, tokenized: true });
};

urlFor.statics = function(path, opts = {}) {
  return urlFor(path, { ...opts, statics: true });
};

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

export function subscribe(channelProp, handlerName) {
  if (isPlainObject(channelProp)) {
    return fayeSubscribe(channelProp);
  }

  return fayeSubscribe({ [channelProp]: handlerName });
}

export function strFilter(string, filter) {
  if (isEmpty(filter)) {
    return true;
  }
  return string.toLowerCase().includes(filter.toLowerCase());
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

      fayeSubscriptions = {};

      componentDidMount() {
        if (super.componentDidMount) super.componentDidMount(...arguments);

        for (const channelProp in setup) {
          if (this.props[channelProp]) {
            subscribe.call(this, this.props[channelProp], setup[channelProp]);
          }
        }
      }

      componentWillReceiveProps(nextProps) {
        if (super.componentWillReceiveProps) super.componentWillReceiveProps(...arguments);

        for (const channelProp in setup) {
          if (!this.fayeSubscriptions[nextProps[channelProp]] && nextProps[channelProp]) {
            subscribe.call(this, nextProps[channelProp], setup[channelProp]);
          }
        }
      }

      componentWillUnmount() {
        if (super.componentWillUnmount) super.componentWillUnmount(...arguments);

        for (const key in this.fayeSubscriptions) {
          this.fayeSubscriptions[key].cancel();
        }
      }
    };
  };
}
