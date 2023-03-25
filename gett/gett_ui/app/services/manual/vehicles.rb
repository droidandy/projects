module Manual
  class Vehicles < Base
    attributes :allowed_services
    attributes :attrs, :company # to have the same interface as other Vehicles services

    def as_vehicles
      [{
        value: 'Special',
        name: 'Special',
        price: 0,
        supports_driver_message: true,
        supports_flight_number: true
      }]
    end

    def can_execute?
      allowed_services.include?(:manual)
    end
  end
end
