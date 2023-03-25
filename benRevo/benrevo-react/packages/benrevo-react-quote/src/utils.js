export function getCarrier(list, displayName) {
  let carrier = '';

  if (list && list.length) {
    list.map((item) => {
      if (item.carrier.displayName === displayName) carrier = item;

      return true;
    });
  }

  return carrier;
}

export function getMode(carrier) {
  let multimode = true;
  if (carrier && carrier.carrier && carrier.carrier.name) {
    const carrierName = carrier.carrier.name.toLowerCase();
    if (carrierName.indexOf('united healthcare') !== -1 || carrierName.indexOf('uhc') !== -1) {
      multimode = false;
    }
  }
  return multimode;
}
