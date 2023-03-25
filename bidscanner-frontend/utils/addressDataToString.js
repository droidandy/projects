const addressToString = address =>
  address
    ? `${address.postal_code}, ${address.street_number}, ${address.street_name}, ${address.city}, ${address
        .country.iso_3166_1_alpha_2}`
    : '';

export default addressToString;
