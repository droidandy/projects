module GoogleApi
  # Reference: https://developers.google.com/maps/documentation/geocoding/intro#GeocodingResponses
  class AddressNormalizer < ApplicationService::NormalizedResponse::Mapper
    AIRPORT_TYPES = [
      'airport',
      'transit_station' # airport terminals are transit stations
    ].freeze
    private_constant :AIRPORT_TYPES

    map from('/result/address_components'), to('/postal_code') do |components|
      fetch_component_value(components: components, name: 'postal_code')
    end
    map from('/result/address_components'), to('/country') do |components|
      fetch_component_value(components: components, name: 'country')
    end
    map from('/result/address_components'), to('/country_code') do |components|
      fetch_component_value(components: components, name: 'country', value: 'short_name')
    end

    map from('/result/address_components'), to('/region') do |components|
      fetch_component_value(components: components, name: 'administrative_area_level_1')
    end

    map from('/result/address_components'), to('/street_name') do |components|
      fetch_component_value(components: components, name: 'route')
    end

    map from('/result/address_components'), to('/street_number') do |components|
      fetch_component_value(components: components, name: 'street_number')
    end

    map from('/result/address_components'), to('/point_of_interest') do |components|
      fetch_component_value(components: components, name: 'political')
    end

    map from('/result/address_components'), to('/city') do |components|
      postal_town = components.find(&finder_for('postal_town'))
      next postal_town.fetch('long_name') if postal_town.present?

      locality = components.find(&finder_for('locality'))
      next locality.fetch('long_name') if locality.present?

      # added for addreses like '..., Brooklyn, New York' where no postal town nor locality present
      # and 'New York' goes under 'administrative_area_level_1'
      fetch_component_value(components: components, name: 'administrative_area_level_1')
    end

    map from('/result/name'), to('/name')
    map from('/result/geometry/location/lat'), to('/lat')
    map from('/result/geometry/location/lng'), to('/lng')
    map from('/result/formatted_address'), to('/formatted_address')
    map from('/result/place_id'), to('/place_id')
    map from('/status'), to('/status')

    after_normalize do |input, output|
      lat, lng = output.values_at(:lat, :lng)

      output.merge!(
        airport_iata: fetch_iata(address_types: input.dig('result', 'types'), lat: lat, lng: lng),
        timezone: Timezones.timezone_at(lat: lat, lng: lng)
      )

      if !::Bookings.international?(output[:country_code]) && output[:postal_code] =~ /^[A-Z\d]{2,4}$/
        long_postal_code = loqate_postal_code(lat: lat, lng: lng)
        output[:postal_code].replace(long_postal_code) if long_postal_code.present?
      end

      output
    end

    def self.finder_for(type)
      ->(component) { component['types'].include?(type) }
    end

    def self.fetch_iata(address_types:, lat:, lng:)
      return if address_types.blank? || address_types.none? { |type| AIRPORT_TYPES.include?(type) }

      Airport.closest(lat, lng)&.iata
    end

    def self.loqate_postal_code(lat:, lng:)
      Loqate::ReverseGeocode.new(lat: lat, lng: lng, closest: true)
        .execute
        .result&.dig(:post_code)
    end

    def self.fetch_component_value(components:, name:, value: 'long_name')
      components.find(&finder_for(name))&.fetch(value)
    end
  end
end
