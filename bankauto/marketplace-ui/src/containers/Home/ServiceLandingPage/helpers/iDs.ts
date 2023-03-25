export const getIds = (o: any) => {
  if (Array.isArray(o)) {
    return o.reduce((pV, cV) => pV.concat(Array.isArray(cV.value) ? cV.value : [cV.value]), []);
  } else if (o?.value) {
    if (Array.isArray(o.value)) {
      return o.value;
    }
    return [o.value];
  }
  return undefined;
};

export const getWorkTypeDescription = (o: any) => {
  if (Array.isArray(o)) {
    return o[0]?.label;
  } else if (o?.label) {
    return o.label;
  }
  return undefined;
};
