import React from 'react';
import { YMaps, Map, Placemark, Clusterer, YMapsApi } from 'react-yandex-maps';
import { Location } from 'types/VehicleFormType';
import { useBreakpoints } from '@marketplace/ui-kit';

type Props = {
  points?: any[];
  address?: Location;
  onPress?: (serviceId: number) => void;
  disabled?: boolean;
  onBoundsChange?: any;
};

type Service = {
  lat: number;
  long: number;
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

export const YMap = ({ points = [], address, onPress, disabled, onBoundsChange }: Props) => {
  const { isMobile } = useBreakpoints();
  const point = address || [55.754135, 37.625101];

  return (
    <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
      <YMaps>
        <Map
          width="100%"
          height={isMobile ? '31.25rem' : '51.75rem'}
          defaultState={{
            center: point,
            zoom: 9,
            controls: ['zoomControl'],
          }}
          modules={['control.ZoomControl', 'geolocation', 'geocode', 'util.bounds']}
          onLoad={(ymaps: YMapsApi) => {
            const geolocation = getGeoLocation(ymaps);
          }}
          onBoundsChange={(props: any) => {
            const [z0, z1] = props.originalEvent?.newBounds;
            onBoundsChange &&
              onBoundsChange({
                swLat: z0[0],
                swLong: z0[1],
                neLat: z1[0],
                neLong: z1[1],
              });
          }}
        >
          <Clusterer
            options={{
              preset: 'islands#blackClusterIcons',
              groupByCoordinates: false,
            }}
          >
            {points.map((p, index) => (
              <Placemark
                key={index}
                options={{
                  preset: 'islands#blackCircleIcon',
                  // iconLayout: 'default#image',
                  // iconImageHref: '/icons/icon-placemark.svg',
                }}
                geometry={[p.lat, p.long]}
                instanceRef={(ref: any) => {
                  ref?.events.add('click', () => {
                    if (!disabled) {
                      onPress && onPress(p.id);
                    }
                  });
                }}
                properties={{
                  hintContent: `Автосервис ${p.name}`,
                  // balloonContent: '',
                }}
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
              />
            ))}
          </Clusterer>
        </Map>
      </YMaps>
    </div>
  );
};
