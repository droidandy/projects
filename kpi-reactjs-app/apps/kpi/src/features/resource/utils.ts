export function getPeriodProp(
  key: string,
  prop: 'aggregated' | 'target' | 'value'
) {
  return `period_${key}_${prop}`;
}

export function getUserBscProp(
  id: number,
  prop: 'allowUpdatingScoringThreshold'
) {
  return `user_${id}_${prop}`;
}

export function getLinkedKpiProp(id: number, prop: 'weight' | 'name') {
  return `linked-kpi_${id}_${prop}`;
}
