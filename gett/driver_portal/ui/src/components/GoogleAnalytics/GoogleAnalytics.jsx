import { Component } from 'react'
import PropTypes from 'prop-types'
import ReactGA from 'react-ga'

export const googleAnalyticsId = process.env.REACT_APP_GOOGLE_ANALYTICS_ID

if (googleAnalyticsId) {
  ReactGA.initialize(googleAnalyticsId)
}

class GoogleAnalytics extends Component {
  static propTypes = {
    location: PropTypes.object,
    pathname: PropTypes.string,
    search: PropTypes.string
  }

  componentDidMount() {
    this.sendPageChange(this.props.location)
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props
    const { location: nextLocation } = nextProps

    if (location.pathname !== nextLocation.pathname || location.search !== nextLocation.search) {
      this.sendPageChange(nextLocation)
    }
  }

  sendPageChange({ pathname, search }) {
    const page = pathname + search
    ReactGA.set({ page })
    ReactGA.pageview(page)
  }

  render() {
    return null
  }
}

export default GoogleAnalytics
