module Splyt
  class Providers < Base
    http_method :get

    attributes :booking_type, :pickup_address

    normalize_response do
      map from('/providers'), to('/providers') do |providers|
        providers.map do |provider|
          normalized =
            normalize(provider) do
              map from('/provider/display_name'),                  to('supplier') { |supplier| "Splyt: #{supplier}" }
              map from('/provider/provider_id'),                   to('provider_id')
              map from('/region/region_id'),                       to('region_id')
              map from('/provider/flags/supports_driver_message'), to('supports_driver_message')
              map from('/provider/flags/supports_flight_number'),  to('supports_flight_number')
              map from('/region/car_types'),                       to('car_types') do |car_types_array|
                car_types_array.map { |car_type| car_type['type'] }
              end
            end

          normalized.reverse_merge(supplier: 'Splyt')
        end
      end
    end

    private def url
      super("/v2/providers/#{booking_type}")
    end

    private def params
      {
        latitude:  pickup_address[:lat],
        longitude: pickup_address[:lng]
      }
    end
  end
end
