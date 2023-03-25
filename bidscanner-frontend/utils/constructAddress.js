import { gql } from 'react-apollo';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { get } from 'lodash';

const COUNTRIES_QUERY = gql`
  query countries($query: String!) {
    countries(query: $query) {
      edges {
        id
        iso_3166_1_alpha_2
        iso_3166_1_alpha_3
        name
      }
    }
  }
`;

const REGIONS_QUERY = gql`
  query regions($location: LocationInput!) {
    regions(location: $location) {
      edges {
        id
        name
      }
    }
  }
`;

export default (async function constructAddress(address, { query }) {
  const [geocode] = await geocodeByAddress(address);
  const { address_components } = geocode;

  try {
    var [
      { long_name: street_number },
      { long_name: street_name },
      ,
      { long_name: city },
      ,
      { long_name: country },
      { long_name: postal_code },
    ] = address_components;
  } catch (err) {
    throw new Error('Please choose more precise address');
  }

  try {
    const { lat: latitude, lng: longitude } = await getLatLng(geocode);

    const countries = await query({
      query: COUNTRIES_QUERY,
      variables: {
        query: country,
      },
    });

    const regions = await query({
      query: REGIONS_QUERY,
      variables: {
        location: {
          latitude,
          longitude,
        },
      },
    });

    return {
      city,
      country_id: get(countries, 'data.countries.edges[0].id'),
      location: {
        latitude,
        longitude,
      },
      postal_code,
      region_id: get(regions, 'data.regions.edges[0].id'),
      street_name,
      street_number,
    };
  } catch (err) {
    throw new Error('Something went wrong, please try again later');
  }
});
