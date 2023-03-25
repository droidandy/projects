import { createContext } from 'react';
import { LatLng } from 'react-native-maps';

type FlyToCallback = (center?: LatLng | null, listIndex?: number) => void;
type TMapContext = { flyTo: FlyToCallback };

export const MapContext = createContext<TMapContext>({
  flyTo: center => console.log('fly to (default)', center),
});
