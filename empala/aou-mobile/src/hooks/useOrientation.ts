import { useState, useEffect } from 'react';
import RNOrientation, { orientation as RNOrientationType } from 'react-native-orientation';

export enum Orientation {
  horizontal,
  vertical,
}

const mapOrientation = (rnOrientation: RNOrientationType): Orientation => (
  rnOrientation === 'PORTRAIT' ? Orientation.vertical : Orientation.horizontal
);

export const useOrientation = (): Orientation => {
  const [orientation, setOrientation] = useState<Orientation>(
    () => mapOrientation(RNOrientation.getInitialOrientation()),
  );

  useEffect(() => {
    const handleOrientationChange = (rnOrientation: RNOrientationType) => setOrientation(mapOrientation(rnOrientation));
    RNOrientation.addOrientationListener(handleOrientationChange);

    return () => {
      RNOrientation.removeOrientationListener(handleOrientationChange);
    };
  });

  return orientation;
};
