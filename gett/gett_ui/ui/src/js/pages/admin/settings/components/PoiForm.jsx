import React from 'react';
import { ModalForm, Input } from 'components/form';
import { Button } from 'components';
import GoogleMap, { Marker } from 'components/GoogleMap';
import { defaultLondonCenter } from 'components/GoogleMap/utils';
import { get } from 'utils';
import { isEmpty } from 'lodash';
import CN from 'classnames';

import css from './style.css';

const coordinateRegexp = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;

export default class PoiForm extends ModalForm {
  validations = {
    line: 'presence',
    lat: ['presence', 'latitude'],
    lng: ['presence', 'longitude'],
    city: 'presence',
    postalCode: ['presence', function() {
      if (!this.state.postalCodeVerified && (this.isNew || this.postalCodeUpdated)) {
        return 'Please click on verify button';
      }
    }]
  };

  onOpen() {
    this.setState({ postalCodeVerified: false });
    this.postalCodeUpdated = false;
  }

  changePostalCode(value) {
    this.postalCodeUpdated = true;

    this.setState({
      postalCodeVerifying: false,
      postalCodeVerified: false
    });

    this.set('postalCode', value);
  }

  verifyPostalCode = () => {
    const { postalCode } = this.props.attrs;

    this.setState({ postalCodeVerifying: true });

    get('/admin/predefined_addresses/validate_postal_code', { postalCode })
      .then(() => {
        this.updateErrors({ postalCode: null });
        this.setState({ postalCodeVerifying: false, postalCodeVerified: true });
      })
      .catch(() => {
        this.updateErrors({ postalCode: 'is invalid' });
        this.setState({ postalCodeVerifying: false, postalCodeVerified: false });
      });
  };

  onCoordinateChange = (input, value) => {
    if ((!isNaN(value) && coordinateRegexp.test(value)) || value === '' || value === '-') {
      this.set(input, value);
    }
  };

  $render($) {
    const { postalCodeVerifying, postalCodeVerified } = this.state;
    const postalCodeReallyVerified = postalCodeVerified || (!this.isNew && !this.postalCodeUpdated);

    const { lat, lng } = isEmpty(this.get()) ? defaultLondonCenter : this.get();

    return (
      <div>
        <Input { ...$('line') } label="POI Name" className="mb-20" labelClassName="required mb-5" />
        <div className="layout horizontal">
          <div className="flex layout vertical">
            <div className="layout horizontal mr-20">
              <Input
                { ...$('postalCode')(this.changePostalCode) }
                label="Postal Code"
                className="mb-20"
                labelClassName="required mb-5"
                disabled={ postalCodeVerifying }
              />
              <Button
                className={ CN('ml-20 mt-23', css.verify, { [css.verified]: postalCodeVerified }) }
                type="primary"
                icon="check"
                loading={ postalCodeVerifying }
                onClick={ this.verifyPostalCode }
                disabled={ !this.get('postalCode') || postalCodeReallyVerified }
              >
                { postalCodeReallyVerified ? 'Verified' : 'Verify' }
              </Button>
            </div>
            <Input { ...$('lat')(this.onCoordinateChange, 'lat') } label="Latitude" className="mb-20 mr-20" labelClassName="required mb-5" />
            <Input { ...$('lng')(this.onCoordinateChange, 'lng') } label="Longitude" className="mb-20 mr-20" labelClassName="required mb-5" />
            <Input { ...$('city') } label="City" className="mb-20 mr-20" labelClassName="required mb-5" />
            <Input { ...$('streetNumber') } label="Street number" className="mb-20 mr-20" labelClassName="mb-5" />
            <Input { ...$('streetName') } label="Street name" className="mb-20 mr-20" labelClassName="mb-5" />
            <Input { ...$('pointOfInterest') } label="Point of interest" className="mb-20 mr-20" labelClassName="mb-5" />
          </div>
          <div className="half-width mb-20">
            <GoogleMap width="100%" height={ 282 } fitBounds>
              <Marker position={ [lat, lng] } icon="start" title="Poi" />
            </GoogleMap>
          </div>
        </div>
        <Input { ...$('additionalTerms') } label="Terms (please separate different terms by space)" className="mb-5" labelClassName="mb-5" />
        <div className="text-12 text-right mb-20">* additional words which will be using for searching POI into address fields</div>
      </div>
    );
  }
}
