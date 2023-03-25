import React, { FC, useState } from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import { useBreakpoints } from '@marketplace/ui-kit';

interface Props {
  latitude: number;
  longitude: number;
}

export const MapSection: FC<Props> = ({ latitude, longitude }) => {
  const [loading, setLoading] = useState(true);
  const { isMobile } = useBreakpoints();
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
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
        <Map
          width="100%"
          height={isMobile ? '21.25rem' : '26.875rem'}
          defaultState={{
            center: [latitude, longitude],
            zoom: 14,
            controls: ['zoomControl', 'fullscreenControl'],
          }}
          modules={['control.ZoomControl', 'control.FullscreenControl']}
          onLoad={() => setLoading(false)}
        >
          <Placemark defaultGeometry={[latitude, longitude]} />
        </Map>
      </YMaps>
    </div>
  );
};
