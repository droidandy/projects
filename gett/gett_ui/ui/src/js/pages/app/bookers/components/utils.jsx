const pieDataCache = new WeakMap;

export function typesDataToPieData(data) {
  if (pieDataCache.has(data)) return pieDataCache.get(data);

  const { asap, scheduled } = data;

  pieDataCache.set(data, [
    { name: 'ASAP', value: asap, fill: '#2a99f5' },
    { name: 'Future Order', value: scheduled, fill: '#e0e5eb' }
  ]);

  return pieDataCache.get(data);
}
