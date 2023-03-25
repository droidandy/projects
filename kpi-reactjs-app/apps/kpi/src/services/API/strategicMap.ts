import { AppStrategicMap } from 'src/types-next';
import { _mockResponse, _getData } from './_utils';

export function _getStrategicMaps(): AppStrategicMap[] {
  return _getData<AppStrategicMap>('data_strategicMaps', []);
}

function _updateStrategicMaps(strategicMaps: AppStrategicMap[]) {
  localStorage.data_strategicMaps = JSON.stringify(strategicMaps);
}

export function getAllStrategicMaps() {
  return _mockResponse(() => {
    const strategicMap = _getStrategicMaps();
    return strategicMap;
  });
}

export function createStrategicMap(values: Omit<AppStrategicMap, 'id'>) {
  return _mockResponse(() => {
    const strategicMap: AppStrategicMap = {
      ...values,
      id: Date.now(),
    };
    const strategicMaps = _getStrategicMaps();
    _updateStrategicMaps([...strategicMaps, strategicMap]);
    return strategicMap;
  });
}

export function updateStrategicMap(id: number, values: AppStrategicMap) {
  return _mockResponse(() => {
    const strategicMaps = _getStrategicMaps();
    const newStrategicMaps = strategicMaps.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateStrategicMaps(newStrategicMaps);
    return values;
  });
}

export function deleteStrategicMap(id: number) {
  return _mockResponse(() => {
    const strategicMaps = _getStrategicMaps();
    const newStrategicMaps = strategicMaps.filter(item => {
      return item.id !== id;
    });
    _updateStrategicMaps(newStrategicMaps);
  });
}
