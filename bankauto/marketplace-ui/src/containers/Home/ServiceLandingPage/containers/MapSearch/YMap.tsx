import React from 'react';
import { YMaps, Map, Placemark, Clusterer, Circle, YMapsApi } from 'react-yandex-maps';
import { AddressContainer, Location } from 'types/VehicleFormType';
import { useBreakpoints } from '@marketplace/ui-kit';
import { AddressAutocomplete } from './AddressAutocomplete';

type Props = {
  radius: number;
  points?: Location[];
  address?: AddressContainer | null;
  onAddressSelect: (address: AddressContainer) => void;
};

const getGeoLocation = (ymaps: YMapsApi) => {
  return ymaps.geolocation.get({ provider: 'yandex', mapStateAutoApply: true }).then((result: any) =>
    ymaps.geocode(result.geoObjects.position).then((res: any) => {
      let firstGeoObject = res.geoObjects.get(0);
      // firstGeoObject.geometry.getCoordinates();
      return firstGeoObject.getLocalities().length
        ? firstGeoObject.getLocalities()
        : firstGeoObject.getAdministrativeAreas();
    }),
  );
};

export const YMap = ({ points = [], address: defaultAddress = null, onAddressSelect, radius }: Props) => {
  const { isMobile } = useBreakpoints();
  const [address, setAddress] = React.useState<AddressContainer | null>(defaultAddress);
  const [loading, setLoading] = React.useState(true);
  const point = address?.location || [55.754135, 37.625101];

  const handleAddressChange = (address: AddressContainer) => {
    setAddress(address);
    onAddressSelect(address!);
  };

  return (
    <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
      {loading && (
        <div
          style={{
            width: '100%',
            height: isMobile ? '21.25rem' : '26.875rem',
            backgroundColor: '#f1f1f1',
          }}
        />
      )}
      <YMaps>
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: isMobile ? '1rem' : '6.25rem',
            right: isMobile ? '1rem' : '6.25rem',
            zIndex: 999,
          }}
        >
          <AddressAutocomplete address={address} onAddressSelect={handleAddressChange} />
        </div>
        <Map
          width="100%"
          height={isMobile ? '21.25rem' : '26.875rem'}
          defaultState={{
            center: point,
            zoom: 9,
            controls: ['zoomControl'],
          }}
          modules={['control.ZoomControl', 'geolocation', 'geocode']}
          onLoad={(ymaps: YMapsApi) => {
            setLoading(false);
            const geolocation = getGeoLocation(ymaps);
          }}
        >
          <Placemark
            options={{
              draggable: true,
              preset: 'islands#blackAutoCircleIcon',
            }}
            geometry={point}
            instanceRef={(ref: any) => {
              ref?.events.add('dragend', () => {
                const location = ref?.geometry.getCoordinates();
                handleAddressChange({
                  address: '',
                  location,
                });
              });
            }}
          />
          <Circle
            geometry={[point, radius * 1000]}
            options={{
              fillColor: '#DB709377',
              strokeColor: '#990066',
              strokeOpacity: 0.8,
              strokeWidth: 1,
            }}
          />
          <Clusterer
            options={{
              preset: 'islands#blackClusterIcons',
              groupByCoordinates: false,
            }}
          >
            {points.map((p) => (
              <Placemark
                options={{
                  preset: 'islands#blackCircleIcon',
                  // iconLayout: 'default#image',
                  // iconImageHref: '/icons/icon-placemark.svg',
                }}
                geometry={p}
              />
            ))}
          </Clusterer>
        </Map>
      </YMaps>
    </div>
  );
};
