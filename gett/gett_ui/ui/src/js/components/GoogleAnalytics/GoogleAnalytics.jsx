import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

if (process.env.GOOGLE_ANALYTICS_ID) {
  ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID);
}

export default class GoogleAnalytics extends Component {
  static propTypes = {
    location: PropTypes.object,
    pathname: PropTypes.string,
    search: PropTypes.string
  };

  componentDidMount() {
    this.sendPageChange(this.props.location);
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname: newPathname, search: newSearch } } = prevProps;
    const { location: { pathname, search } } = this.props;
    if (pathname !== newPathname || search !== newSearch) {
      this.sendPageChange(location);
    }
  }

  sendPageChange({ pathname, search }) {
    const page = pathname + search;
    ReactGA.set({ page });
    ReactGA.pageview(page);
  }

  render() {
    return null;
  }
}
