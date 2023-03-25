import { find } from 'lodash'

export const geocodeByPlaceId = (placeId) => {
  const geocoder = new window.google.maps.Geocoder()
  const OK = window.google.maps.GeocoderStatus.OK

  return new Promise((resolve, reject) => {
    geocoder.geocode({ placeId }, (results, status) => {
      if (status !== OK) {
        reject(status)
      }
      const city = find(results[0].address_components, item => item.types[0] === 'postal_town')

      const postalCode = find(results[0].address_components, item => item.types[0] === 'postal_code')

      resolve({ city: city ? city.long_name : '', postalCode: postalCode ? postalCode.long_name : '' })
    })
  })
}

export default geocodeByPlaceId
