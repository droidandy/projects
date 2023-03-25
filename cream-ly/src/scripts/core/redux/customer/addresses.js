export default (list) => {
  if (!list || !Array.isArray(list)) return [];
  return list.filter((address) => !isDigitalAddress(address));
};

export const isDigitalAddress = (address) => {
  return (
    (address.address1 == address.city && address.city != null) ||
    (address.firstName == address.lastName && address.lastName != null)
  );
};
