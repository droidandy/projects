import React from 'react';
import { ReactComponent as Document } from 'icons/DocumentSmall.svg';
import { ReactComponent as MapPin } from 'icons/MapPin.svg';

export const getPdfIcon = (iconVariant: string) => {
  switch (iconVariant) {
    case 'document':
      return <Document width="1.5rem" />;
    case 'mapPin':
      return <MapPin width="2rem" />;
    default:
      return <Document width="1.5rem" />;
  }
};
