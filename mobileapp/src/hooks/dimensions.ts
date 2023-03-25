import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface DimensionsProps {
  window: ScaledSize;
  screen: ScaledSize;
}

const getDimensions = (): DimensionsProps => ({
  window: Dimensions.get('window'),
  screen: Dimensions.get('screen'),
});

const useDimensions = (): DimensionsProps => {
  const [dimensions, setDimensions] = useState<DimensionsProps>(getDimensions);

  useEffect(() => {
    const onChange = (result: DimensionsProps): void => {
      setDimensions(result);
    };

    Dimensions.addEventListener('change', onChange);

    return (): void => Dimensions.removeEventListener('change', onChange);
  }, []);

  return dimensions;
};

export default useDimensions;
