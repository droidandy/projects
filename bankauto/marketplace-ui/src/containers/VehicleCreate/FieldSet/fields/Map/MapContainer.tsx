import React, { useRef, useEffect, useMemo } from 'react';
import { initMap } from './utils';
import { AddressContainer, Location } from 'types/VehicleFormType';

type MapContainerProps = {
  address?: AddressContainer | null;
  onAddressSelect: (address: AddressContainer) => void;
};

export const MapContainer = ({ address, onAddressSelect }: MapContainerProps) => {
  const init = async () => {
    const { ymaps } = window as any;

    const map = new ymaps.Map('map-container', {
      center: address?.location || [55.753994, 37.622093],
      zoom: 9,
      controls: ['zoomControl'],
    });

    if (address) {
      placemark.current = createPlacemark(address.location, address.address);
      placemark.current.events.add('dragend', () => {
        getAddress(placemark.current.geometry.getCoordinates());
      });
      map.geoObjects.add(placemark.current);
    }

    initAddressSelect(map);
  };

  useEffect(() => {
    const { ymaps } = window as any;
    if (!ymaps) {
      initMap(() => {
        const { ymaps } = window as any;
        ymaps.ready(init);
      });
    } else {
      ymaps.ready(init);
    }
  }, []);

  const placemark = useRef<any | null>(null);

  const initAddressSelect = useMemo(
    () => (map: any) => {
      map.events.add('click', (e: any) => {
        const coords = e.get('coords');

        if (placemark.current) {
          placemark.current.geometry.setCoordinates(coords);
        } else {
          placemark.current = createPlacemark(coords);
          map.geoObjects.add(placemark.current);
          placemark.current.events.add('dragend', () => {
            getAddress(placemark.current.geometry.getCoordinates());
          });
        }
        getAddress(coords);
      });
    },
    [],
  );

  const createPlacemark = (coords: any, caption?: string) => {
    const { ymaps } = window as any;

    return new ymaps.Placemark(
      coords,
      {
        iconCaption: caption,
      },
      {
        preset: 'islands#violetDotIconWithCaption',
        draggable: true,
      },
    );
  };

  const getAddress = async (coords: Location) => {
    const { ymaps } = window as any;

    placemark.current.properties.set('iconCaption', 'поиск...');
    const res = await ymaps.geocode(coords);
    const firstGeoObject = res.geoObjects.get(0);

    const address = firstGeoObject.getAddressLine();

    placemark.current.properties.set({
      iconCaption: [
        firstGeoObject.getLocalities().length
          ? firstGeoObject.getLocalities()
          : firstGeoObject.getAdministrativeAreas(),
        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
      ]
        .filter(Boolean)
        .join(', '),
      balloonContent: address,
    });

    onAddressSelect({
      address,
      location: coords,
    });
  };

  const handleAddressChange = (address?: AddressContainer | null) => {
    if (address && placemark.current) {
      placemark.current.geometry.setCoordinates(address.location);
      placemark.current.properties.set({
        iconCaption: address.address,
        balloonContent: address.address,
      });
    }
  };

  useEffect(() => handleAddressChange(address), [address]);

  return (
    <div
      id="map-container"
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};
