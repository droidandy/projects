import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { LocationView } from './components/LocationView';
import {
  LocationActions,
  LocationState,
  handle,
  getLocationState,
} from './interface';
import { getRouterState, RouterActions } from 'typeless-router';
import {
  LocationFormActions,
  useLocationForm,
  getLocationFormState,
} from './location-form';
import {
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} from 'src/services/API';
import { catchErrorAndShowModal } from 'src/common/utils';
import { GlobalActions } from '../global/interface';
import { Location } from 'src/types';
import { isHeadquarterOptions } from '../locations/utils';
import { GOOGLE_MAPS_API_KEY } from 'src/config';
import { ActionLike } from 'typeless';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

declare global {
  interface Window {
    GOOGLE_MAP_CALLBACKS: Array<() => any>;
    IS_GOOGLE_MAP_LOADED: boolean;
    GOOGLE_MAP_CALLBACK: () => void;
  }
}

window.GOOGLE_MAP_CALLBACKS = [];
window.GOOGLE_MAP_CALLBACK = () => {
  window.IS_GOOGLE_MAP_LOADED = true;
  window.GOOGLE_MAP_CALLBACKS.forEach(cb => cb());
};

// --- Epic ---
handle
  .epic()
  .on(LocationActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));
    return id === 'new'
      ? [LocationFormActions.reset(), LocationActions.loaded(null)]
      : getLocation(id).pipe(
          Rx.mergeMap(ret => [
            BreadcrumbsActions.update({
              en: ret.name.en,
              ar: ret.name.ar,
            }),
            LocationFormActions.replace({
              ...R.pick(ret, ['poBox', 'city', 'country']),
              name_en: ret.name.en,
              name_ar: ret.name.ar,
              address_en: ret.address.en,
              address_ar: ret.address.en,
              long: String(ret.long),
              lat: String(ret.lat),
              isHeadquarter: isHeadquarterOptions.find(
                x => x.value === ret.isHeadquarter
              )!,
            }),
            LocationActions.loaded(ret),
          ]),
          catchErrorAndShowModal()
        );
  })
  .on(LocationActions.initMap, (_, { action$ }) => {
    return new Rx.Observable<ActionLike>(subscribe => {
      if (!window.IS_GOOGLE_MAP_LOADED) {
        window.GOOGLE_MAP_CALLBACKS.push(load);
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=GOOGLE_MAP_CALLBACK`;
        document.body.appendChild(script);
      } else {
        load();
      }
      let map: google.maps.Map;
      function load() {
        const node = document.getElementById('map');
        if (!node) {
          return;
        }
        const { location } = getLocationState();
        map = new google.maps.Map(
          node,
          location
            ? {
                center: { lat: location.lat, lng: location.long },
                zoom: 12,
              }
            : {
                center: { lat: 0, lng: 0 },
                zoom: 2,
              }
        );
        let marker: google.maps.Marker;

        const setMarker = (lat: number, lng: number) => {
          if (marker) {
            marker.setPosition({
              lat,
              lng,
            });
          } else {
            marker = new google.maps.Marker({
              position: {
                lat,
                lng,
              },
              map,
            });
          }
        };
        if (location) {
          setMarker(location.lat, location.long);
        }

        google.maps.event.addListener(
          map,
          'click',
          (event: google.maps.MouseEvent) => {
            setMarker(event.latLng.lat(), event.latLng.lng());
            subscribe.next(
              LocationFormActions.changeMany({
                lat: String(event.latLng.lat()),
                long: String(event.latLng.lng()),
              })
            );
          }
        );
      }
      return () => {
        if (map) {
          map.unbindAll();
        }
      };
    }).pipe(Rx.takeUntil(action$.pipe(Rx.ofType(LocationActions.$unmounted))));
  })
  .on(LocationFormActions.setSubmitSucceeded, () => {
    const { location } = getLocationState();
    const { values } = getLocationFormState();
    const mapped: Omit<Location, 'id'> = {
      ...R.pick(values, ['poBox', 'city', 'country']),
      name: {
        ar: values.name_ar,
        en: values.name_en,
      },
      address: {
        ar: values.address_ar,
        en: values.address_en,
      },
      long: Number(values.long),
      lat: Number(values.lat),
      isHeadquarter: values.isHeadquarter.value,
    };
    return Rx.concatObs(
      Rx.of(LocationActions.setSaving(true)),
      Rx.defer(() => {
        if (location) {
          return updateLocation(location.id, {
            id: location.id,
            ...mapped,
          });
        }
        return createLocation(mapped);
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              location
                ? 'Location updated successfully'
                : 'Location created successfully'
            ),
            RouterActions.push('/settings/locations'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(LocationActions.setSaving(false))
    );
  })
  .on(LocationActions.remove, () => {
    return Rx.concatObs(
      Rx.of(LocationActions.setDeleting(true)),
      deleteLocation(getLocationState().location!.id).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              'Location deleted successfully'
            ),
            RouterActions.push('/settings/locations'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(LocationActions.setDeleting(false))
    );
  });

// --- Reducer ---
const initialState: LocationState = {
  id: '',
  isLoading: true,
  isSaving: false,
  isDeleting: false,
  location: null,
};

handle
  .reducer(initialState)
  .replace(LocationActions.$init, () => initialState)
  .on(LocationActions.loaded, (state, { location }) => {
    state.location = location;
    state.isLoading = false;
  })
  .on(LocationActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(LocationActions.setDeleting, (state, { isDeleting }) => {
    state.isDeleting = isDeleting;
  });

// --- Module ---
export default () => {
  useLocationForm();
  handle();
  return <LocationView />;
};
