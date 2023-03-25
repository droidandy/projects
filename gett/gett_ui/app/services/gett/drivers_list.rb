class Gett::DriversList < ApplicationService
  include ApplicationService::RestMethods
  include ApplicationService::NormalizedResponse

  attributes :lat, :lng, :country_code

  # Internal ids of vehicle types in location service
  BLACK_TAXI_XL_IDS = [66, 72].freeze

  BASE_URL = Settings.gett_api.drivers_locations_url.freeze
  DEFAULT_COUNTRY = 'gb'.freeze
  ALLOWED_COUNTRIES = %w(gb ru il).freeze
  COUNTRIES_WITH_SPECIFIC_TAXI = %w(ru il).freeze
  DEFAULT_RADIUS = 1.5
  DEFAULT_DRIVERS_COUNT = 20

  private_constant :BASE_URL, :DEFAULT_COUNTRY, :DEFAULT_RADIUS

  normalize_response do
    map from('/drivers'), to('/drivers') do |drivers|
      normalize_array(drivers) do
        map from('/id'), to('/id')
        map from('/status'), to('/status')
        map from('/divisions'), to('/car_type') do |divisions|
          if BLACK_TAXI_XL_IDS.any? { |id| divisions.include?(id) }
            'BlackTaxiXL'
          else
            'BlackTaxi'
          end
        end
        map from('/last_locations'), to('/locations') do |locations|
          normalize_array(locations) do
            map from('/accuracy'), to('/accuracy')
            map from('/bearing'), to('/bearing')
            map from('/lat'), to('/lat')
            map from('/lon'), to('/lng')
            map from('/speed'), to('/speed')
            map from('/ts'), to('/ts')
          end
        end
      end
    end
  end

  def execute!
    get(url, content_type: 'application/json')
    result do
      if normalized_response.present?
        drivers_list
      else
        []
      end
    end
  end

  private def url
    base_url = BASE_URL.sub(':country_code', country_param)

    "#{base_url}?#{params.to_query}"
  end

  private def drivers_list
    normalized_response[:drivers].tap do |resp|
      if country_param.in?(COUNTRIES_WITH_SPECIFIC_TAXI)
        resp.each{ |driver| driver[:car_type] = 'Taxi' }
      end
    end
  end

  private def country_param
    @country_param ||=
      ALLOWED_COUNTRIES.include?(country_code&.downcase) ? country_code.downcase : DEFAULT_COUNTRY
  end

  private def params
    {
      radius: DEFAULT_RADIUS,
      count: DEFAULT_DRIVERS_COUNT,
      lat: lat,
      lon: lng
    }
  end
end
