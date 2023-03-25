import { strings } from 'locales';

export const prepareAddress = (address, name, type) => (
  address && ({ address: { ...address, label: name }, name, type })
);

export const prepareFavAddresses = (addresses = []) => (
  addresses.map(item => ({ ...item, address: { ...item.address, label: item.name } }))
);

export const prepareDefaultValues = ({ favoriteAddresses, homeAddress, workAddress } = {}) => (
  [
    homeAddress && homeAddress.line && prepareAddress(homeAddress, strings('app.label.home'), 'home'),
    workAddress && workAddress.line && prepareAddress(workAddress, strings('app.label.work'), 'work'),
    ...prepareFavAddresses(favoriteAddresses)
  ].filter(Boolean)
);
