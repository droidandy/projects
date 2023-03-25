/* global google */
import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { toLatLng, getMarkerIcon } from './utils'
import isEqual from 'lodash/isEqual'

export default class Marker extends PureComponent {
  static propTypes = {
    map: PropTypes.object,
    position: PropTypes.object,
    title: PropTypes.string,
    content: PropTypes.string,
    type: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onClick: PropTypes.func
  };

  componentDidMount() {
    this.addMarker()
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.position, this.props.position)) {
      this.removeMarker()
      this.addMarker(nextProps)
    }
  }

  componentWillUnmount() {
    this.removeMarker()
  }

  addMarker(props = this.props) {
    const { map, position, title, content, onClick, type } = props

    this.marker = new google.maps.Marker({
      map,
      position: toLatLng(position),
      title,
      icon: getMarkerIcon(type)
    })

    if (onClick) {
      this.marker.addListener('click', () => onClick(this.marker, content))
    }
  }

  removeMarker() {
    this.marker.setMap(null)
  }

  render() {
    return null
  }
}
