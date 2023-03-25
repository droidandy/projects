//  address {
// id
// postal_code -
// street_number -
// street_name -
// city -
// country {
//   id
//   iso_3166_1_alpha_2
// }
// location {
//   latitude
//   longitude
// }
// region {
//   id
// }
// }

// transform data from graphql query above to the AdressInput (mutation argument)

const addressDataToAddressInput = addressData => {
  if (!addressData) {
    return null;
  }
  /*eslint-disable */
  const { country, region, id, ...other } = addressData;
  /*eslint-enable */
  return {
    ...other,
    region_id: region.id,
    country_id: country.id,
  };
};

export default addressDataToAddressInput;
