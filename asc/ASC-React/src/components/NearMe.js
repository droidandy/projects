import React from 'react';
import GoogleMap from 'google-map-react';

import {
  Page,
  Icon
} from 'react-onsenui';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as utilityActions from '../redux/utility';

import ToolbarMobile from './ToolbarMobile';
import MapMark from './MapMark';
import dataMapMarker from '../data/dataMapMarker';

var config = require('../config');

const K_MARGIN_TOP = 30;
const K_MARGIN_RIGHT = 30;
const K_MARGIN_BOTTOM = 30;
const K_MARGIN_LEFT = 30;

@connect((state) => ({ navigator: state.navigator, panel: state.panel, auth: state.auth, utility: state.utility, map: state.map }),
  (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...utilityActions}, dispatch) }))

class NearMe extends React.Component {

  constructor(props) {
    super(props);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.getLocationSuccess = this.getLocationSuccess.bind(this);
    this.changeMapBounds = this.changeMapBounds.bind(this);
    this.renderMapMarks = this.renderMapMarks.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.state = {
      isOpenModal: false,
      showPeople: true,
      showEvents: true,
      showGroups: true,
      data: dataMapMarker,
      mapBoundedList: [],
      currentLocation: {lat: 38.971763, lng: -97.411287},
      currentZoom: 5,
      positionIcon: 'ion-android-locate'
    };
  }

  getLocationSuccess(position) {
    this.setState({
      positionIcon: 'ion-android-locate',
      positionIconSpin: false,
      currentLocation: {lat: position.coords.latitude, lng: position.coords.longitude},
      currentZoom: 12
    });
  }

  renderToolbar() {
    return (
      this.props.utility.isMobile
        ? <ToolbarMobile />
        : null
    );
  }

  filterArr(arr) {
    return arr.filter((item) => {
      if (item.type === 'people') {
        if ((item.sport === this.props.map.peopleSportType || this.props.map.peopleSportType === 'All') &&
            (item.level === this.props.map.peopleSportLevel || this.props.map.peopleSportLevel === 'All')) {
          return this.props.map.showPeople;
        }
      }
      if (item.type === 'event') {
        if ((item.sport === this.props.map.eventsSportType || this.props.map.eventsSportType === 'All') &&
            (item.level === this.props.map.eventsSportLevel || this.props.map.eventsSportLevel === 'All')) {
          return this.props.map.showEvents;
        }
      }
      if (item.type === 'group') {
        if ((item.sport === this.props.map.groupsSportType || this.props.map.groupsSportType === 'All') &&
            (item.level === this.props.map.groupsSportLevel || this.props.map.groupsSportLevel === 'All')) {
          return this.props.map.showGroups;
        }
      } else {
        return false;
      }
    });
  }

  hideInfo(item, idx) {
    let data = this.state.data;
    data[idx].showInfo = false;
    this.setState({data});
  }

  renderMapMarks(arr) {
    return (this.filterArr(arr).map((item, idx) => {
      return (<MapMark
        type={item.type}
        name={item.name}
        sport={item.sport}
        level={item.level}
        conversationId={item.id}
        key={idx}
        showInfo={item.showInfo}
        hideInfo={() => { this.hideInfo(item, idx); }}
        lat={item.location.lat}
        lng={item.location.lng} />
      );
    }));
  }

  locationInScreen(location, nw, se) {
    return (
      (nw.lat > location.lat && location.lat > se.lat) &&
      (nw.lng < location.lng && location.lng < se.lng)
    );
  }

  changeMapBounds(newBounds) {
    let filteredList = [];
    filteredList = this.filterArr(this.state.data).filter((item) => {
      return this.locationInScreen(item.location, newBounds.bounds.nw, newBounds.bounds.se);
    });
    this.setState({mapBoundedList: filteredList});
  }

  createMapOptions(maps) {
    // next props are exposed at maps
    // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
    // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
    // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
    // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
    // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
    return {
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: maps.ControlPosition.RIGHT_BOTTOM,
        style: maps.ZoomControlStyle.SMALL
      },
      mapTypeControl: false
    };
  }

  render() {
    return (
      <Page renderToolbar={this.renderToolbar}>
      { this.props.navigator.openMap &&
        this.props.navigator.namePage === 'NEAR ME'
        ? <div id='map' className='nearMe__map'>
            <GoogleMap id='map-component'
              bootstrapURLKeys={{
                key: `${config.GOOGLEMAPS_SECRET}`
              }}
              // experimental={false}
              onChange={this.changeMapBounds}
              // onChange={(res) => { console.log('bounds: ', res.bounds, '\ncenter: ', res.center, '\nmarginBounds: ', res.marginBounds, '\nsize: ', res.size, '\nzoom: ', res.zoom); }}
              margin={[K_MARGIN_TOP, K_MARGIN_RIGHT, K_MARGIN_BOTTOM, K_MARGIN_LEFT]}
              center={this.state.currentLocation}
              zoom={this.state.currentZoom}
              options={this.createMapOptions}
              onChildClick={(e) => {
                console.log('child click', +e, this.state.data[+e].location);
                let data = this.state.data;
                data[+e].showInfo = true;
                this.setState({data: data});
              } }
              // onClick={(e) => { console.log(e); } }
              onGoogleApiLoaded={({map, maps}) => { this.setState({map: map, maps: maps}); }}
              yesIWantToUseGoogleMapApiInternals
              >
                {this.renderMapMarks(this.state.data)}
            </GoogleMap>
            <div className='nearMe__topButton nearMe__myPosition__divbtn' onClick={() => {
              this.setState({positionIcon: 'fa-cog', positionIconSpin: true});
              navigator.geolocation.getCurrentPosition(
                this.getLocationSuccess,
                (err) => { console.log('err', err); },
                { enableHighAccuracy: true }
              );
            }}>
              <Icon spin={this.state.positionIconSpin} icon={this.state.positionIcon}/>
            </div>

            <div className='nearMe__topButton nearMe__filter__divbtn' onClick={() => {
              this.props.actions.pushModal('NearMeModal');
            }}>
              <Icon icon='ion-levels'/>
            </div>

            <div className='nearMe__topButton nearMe__refresh__divbtn' onClick={() => {
              let arr = this.state.mapBoundedList.slice();
              this.setState({mapBoundedList: this.filterArr(arr)});
            }}>
              <Icon icon='ion-loop'/>
            </div>

            <div className='nearMe__topButton nearMe__list__divbtn' onClick={() => {
              // console.log(this.state.mapBoundedList.length);
              // alert(`There are ${this.state.mapBoundedList.length} elements on map`);
            }}>
              <Icon icon='ion-android-list'/>
            </div>

            <div className='nearMe__topButton nearMe__list2__divbtn' onClick={() => {
            }}>
              {this.state.mapBoundedList.length}
            </div>
          </div>
        : null}
      </Page>
    );
  }
}

export default NearMe;
