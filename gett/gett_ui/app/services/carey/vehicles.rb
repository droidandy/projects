module Carey
  class Vehicles < Base
    include ApplicationService::CurrencyHelpers

    # LS03 - luxury sedans
    # ES03 - executive sedans
    # SU04 - sport utility vehicle
    VEHICLE_CODES = %w(LS03 ES03 SU04).freeze

    attributes :attrs, :allowed_services
    attributes :company # to have the same interface as other Vehicles services

    def soap_method
      :rate_inquiry
    end

    normalize_response do
      map from('/ground_services/ground_service'), to('/vehicles') do |vehicles|
        vehicles = vehicles.is_a?(Hash) ? [vehicles] : vehicles

        normalize_array(vehicles) do
          map from('/shuttle/vehicle/type'), to('/name')
          map from('/service/vehicle_make_model/@name'), to('/code')
          map from('/service/service_level/@code'), to('/service_category')
          map from('/total_charge/@rate_total_amount'), to('/price')
        end
      end
    end

    def options
      {
        POS: pos_structure,
        Service: stops_structure,
        ServiceType: {
          :@Code => stops.one? ? SERVICE_AS_DIRECTED : SERVICE_POINT_TO_POINT,
          :@Description => SERVICE_DESCRIPTION
        },
        VehiclePrefs: vehicle_codes,
        RateQualifier: rate_qualifier
      }
    end

    private def stop_structure(address, datetime = nil)
      structure = address[:airport_iata].present? ? airport_structure(address) : address_structure(address)
      structure[:@DateTime] = datetime.strftime('%Y-%m-%dT%H:%M:%S') if datetime.present?
      structure
    end

    private def airport_data(address)
      {
        :@AirportName => address[:line].split(/,\s*/).first,
        :@LocationCode => address[:airport_iata]
      }
    end

    def as_vehicles
      car_options = (success? ? normalized_response[:vehicles] : [])
      car_options.uniq.map{ |car| rate_inquiry_as_vehicles(car) }.compact
    end

    private def rate_inquiry_as_vehicles(rate)
      price = convert_currency(amount: rate[:price].to_f, from: 'USD')
      {
        value: rate[:code],
        name: 'Chauffeur',
        price: price * 100,
        quote_id: rate[:code],
        supports_driver_message: true,
        supports_flight_number: true
      }
    end

    private def stops
      [
        attrs[:pickup_address],
        * attrs[:stops]&.map{ |stop| stop[:address] },
        attrs[:destination_address]
      ]
    end

    private def scheduled_at
      attrs[:scheduled_at]
    end

    private def vehicle_codes
      VEHICLE_CODES.map do |code|
        {Type: {:@Code => code}}
      end
    end

    def can_execute?
      allowed_services.include?(:carey) && attrs[:later]
    end
  end
end
