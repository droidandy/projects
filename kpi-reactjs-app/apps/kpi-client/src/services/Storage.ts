export { getAccessToken, setAccessToken } from 'shared/Storage';
import { clearStorage as baseClearStorage } from 'shared/Storage';

export const clearStorage = () => {
  baseClearStorage();
  localStorage.removeItem('selectedStrategicPlan');
};

export function getSelectedStrategicPlan() {
  return (
    localStorage.selectedStrategicPlan &&
    Number(localStorage.selectedStrategicPlan)
  );
}

export function setSelectedStrategicPlan(id: number) {
  localStorage.selectedStrategicPlan = id;
}
