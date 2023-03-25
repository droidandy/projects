import React from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import { useBreakpoints } from '@marketplace/ui-kit';

interface Props {
  latitude: number;
  longitude: number;
}

const AboutMapSection = ({ latitude, longitude }: Props) => {
  const { isMobile } = useBreakpoints();
  return (
    <div style={{ overflow: 'hidden' }}>
      <YMaps>
        <Map
          width="100%"
          height={isMobile ? '25rem' : '40rem'}
          defaultState={{
            center: [latitude, longitude],
            zoom: 14,
            controls: ['zoomControl', 'fullscreenControl'],
          }}
          modules={['control.ZoomControl', 'control.FullscreenControl']}
        >
          <Placemark
            options={{
              iconLayout: 'default#image',
              iconImageHref: '/icons/icon-placemark.svg',
            }}
            defaultGeometry={[latitude, longitude]}
          />
        </Map>
      </YMaps>
    </div>
  );
};

export { AboutMapSection };
