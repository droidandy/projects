module OneTransport
  class Vehicles < Base
    attributes :attrs, :allowed_services

    private def header_options
      { max_reply: 10 }
    end

    def soap_method
      :job_quote
    end

    normalize_response do
      map from('/general/quote_id'), to('/quote_id')
      map from('/quotes'), to('/quotes') do |quotes|
        quotes = quotes.is_a?(Hash) ? [quotes] : quotes
        vehicles = quotes[0][:quote_structure]
        vehicles = vehicles.is_a?(Hash) ? [vehicles] : vehicles

        normalize_array(vehicles) do
          map from('/vehicle_type'), to('/vehicle_type')
          map from('/vehicle_class'), to('/vehicle_class')
          map from('/charges/charge_structure'), to('/charge') do |charge_structure|
            charge_structure.find{ |charge| charge[:charge_name] == 'FARE_QUOTE' }[:amount]
          end
        end
      end
    end

    def options
      {
        general: {
          quote_type: 'Fixed',
          client: {
            client_number: company.ot_client_number,
            client_name:   ''
          },
          flags: {
            wait_and_return: wait_and_return?,
            journey_reason:  'Work to Home',
            num_passengers:  1,
            origin:          'Web',
            job_charge_type: 'Fixed'
          }
        },
        stops: { stop_structure: stop_structure(passenger, stops, attrs[:scheduled_at]) }
      }
    end

    def as_vehicles
      success? ? job_quote_as_vehicles(normalized_response) : []
    end

    def can_execute?
      allowed_services.include?(:ot)
    end

    private def job_quote_as_vehicles(job_quote_hash)
      job_quote_hash ||= {quotes: []}

      Array(job_quote_hash[:quotes])
        .map{ |quote| quote_to_vehicle(quote) }
        .compact
        .map{ |data| data.merge(quote_id: job_quote_hash[:quote_id]) }
    end

    private def quote_to_vehicle(quote)
      vehicle = ot_vehicles_ids["#{quote[:vehicle_type]}_#{quote[:vehicle_class]}"]

      return if vehicle.blank?

      result = {
        value: vehicle.value,
        name: vehicle.name,
        supports_driver_message: true,
        supports_flight_number: true
      }
      result[:price] = quote[:charge].to_f
      result
    end

    private def ot_vehicles_ids
      @ot_vehicles_ids ||= ::Vehicle.ot.to_hash(:value)
    end

    private def passenger
      first_name, last_name = (attrs[:passenger_name] || '').split(/\s+/, 2)
      {
        first_name: first_name || ' ',
        last_name: last_name || ' ',
        phone_number: attrs[:passenger_phone] || ' ',
        passenger_type: PASSENGER_TYPE_GUEST
      }
    end

    def stops
      [
        pickup,
        *Array(attrs[:stops]).map{ |stop| stop_data(stop[:address]) },
        destination
      ]
    end

    private def pickup
      attrs[:pickup_address].slice(:lat, :lng, :line, :postal_code, :country_code)
    end

    private def stop_data(stop)
      {
        postal_code: stop[:postal_code],
        lat: stop[:lat],
        lng: stop[:lng],
        line: stop[:line],
        country_code: stop[:country_code]
      }
    end

    private def destination
      attrs[:destination_address].slice(:lat, :lng, :line, :postal_code, :country_code)
    end
  end
end
