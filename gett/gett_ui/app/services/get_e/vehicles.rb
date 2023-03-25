module GetE
  class Vehicles < Base
    http_method :post

    attributes :attrs, :allowed_services
    attributes :company # to have the same interface as other Vehicles services

    private def url
      super('/quotes')
    end

    private def params
      {
        Pickup: {
          Place: place(attrs[:pickup_address][:place_id]),
          Address: { AddressLine: attrs[:pickup_address][:line] },
          Airport: airport(attrs[:pickup_address][:lat], attrs[:pickup_address][:lng]),
          Location: {
            Latitude: attrs[:pickup_address][:lat].to_f,
            Longitude: attrs[:pickup_address][:lng].to_f
          },
          PickupTime: pickup_time.strftime('%Y-%m-%dT%H:%M:%S') # ISO 8601 without timezone part
        },
        DropOff: {
          Place: place(attrs[:destination_address][:place_id]),
          Address: { AddressLine: attrs[:destination_address][:line] },
          Airport: airport(attrs[:destination_address][:lat], attrs[:destination_address][:lng]),
          Location: {
            Latitude: attrs[:destination_address][:lat].to_f,
            Longitude: attrs[:destination_address][:lng].to_f
          }
        }
      }
    end

    def pickup_time
      return attrs[:scheduled_at] unless attrs[:later]

      # NOTE: according to logic in Bookings::Vehicles#vehicles_params, attrs[:scheduled_at]
      # already has to be in time zone of pickup address.
      attrs[:scheduled_at].in_time_zone(attrs.dig(:pickup_address, :timezone))
    end

    def can_execute?
      allowed_services.include?(:get_e)
    end

    def as_vehicles
      car_options = (success? && response.data.with_indifferent_access[:data][:CarOptions]).presence || []
      car_options.uniq.map{ |car| car_to_vehicle(car) }.compact
    end

    private def car_to_vehicle(car)
      vehicle = get_e_vehicles_ids[car[:Details][:Name]]
      return if vehicle.blank?

      vehicle = {
        value: vehicle.value,
        name: vehicle.name,
        quote_id: car[:Uuid], # quote id is different for each quote request
        supports_driver_message: true,
        supports_flight_number: true
      }
      price = car.dig(:Pricing, :Price, :Amount)
      vehicle[:price] = price.to_i * 100.0 if price.present?

      vehicle
    end

    private def get_e_vehicles_ids # rubocop:disable Naming/AccessorMethodName
      @get_e_vehicles_ids ||= ::Vehicle.get_e.to_hash(:value)
    end

    private def place(place_id)
      return {} if place_id.blank?

      { Id: place_id }
    end

    private def airport(lat, lng)
      airport = Airport.closest(lat, lng)
      airport.present? ? { Iata: airport.iata } : {}
    end
  end
end
