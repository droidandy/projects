export { getAccessToken, setAccessToken } from 'shared/Storage';
import { clearStorage as baseClearStorage } from 'shared/Storage';

export const clearStorage = () => {
  baseClearStorage();
  localStorage.removeItem('selectedUnit');
};

export function setSelectedStrategicPlan(id: number) {
  localStorage.selectedStrategicPlan = id;
}

export function getSelectedStrategicPlan() {
  return (
    localStorage.selectedStrategicPlan &&
    Number(localStorage.selectedStrategicPlan)
  );
}

export function setSelectedOrganization(id: number) {
  localStorage.selectedOrganization = id;
}

export function getSelectedOrganization() {
  return (
    localStorage.selectedOrganization &&
    Number(localStorage.selectedOrganization)
  );
}

export function setSelectedUnit(id: number) {
  localStorage.selectedUnit = id;
}

export function getSelectedUnit() {
  return localStorage.selectedUnit && Number(localStorage.selectedUnit);
}

export function setThemeColor(id: number) {
  localStorage.themeColor = id;
}

export function getThemeColor() {
  return localStorage.themeColor && Number(localStorage.themeColor);
}
