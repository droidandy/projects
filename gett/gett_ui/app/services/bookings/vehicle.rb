require 'ostruct'

module Bookings
  class Vehicle < OpenStruct
    VEHICLE_NAMES = %w[
      Standard
      BlackTaxi
      BlackTaxiXL
      OTBlackTaxi
      OTBlackTaxiXL
      Exec
      MPV
      Courier
      Special
      Porsche
      GettXL
      GettExpress
      Economy
      StandardXL
      Business
      BabySeat
      Wheelchair
      Chauffeur
    ].freeze
    PRIORITY = VEHICLE_NAMES.each_with_index.map{ |name, i| [name, i] }.to_h.freeze
    BASE_VEHICLE_NAMES = (VEHICLE_NAMES - ::Vehicle::FALLBACKS.keys).without('Courier', 'Porsche').freeze

    private_constant :PRIORITY

    delegate :inquiry, to: :service_type, prefix: true

    Bookings::API_TYPES.each_key do |st|
      delegate "#{st}?".to_sym, to: :service_type_inquiry
    end

    def self.all
      vehicles =
        DB[:vehicle_products].all
          .map{ |values| new(values) }
          .sort_by{ |vehicle| PRIORITY[vehicle.name] }

      vehicles.each do |vehicle|
        next unless ::Vehicle::FALLBACKS.key?(vehicle.name)

        primary = vehicles.find{ |veh| veh.name == ::Vehicle::FALLBACKS[vehicle.name] }
        vehicle.primary = primary
        primary.fallback = vehicle
      end
    end

    def available!
      self.available = true
    end

    def disallow_with!(reason)
      self.available = false
      self.reason = reason
    end

    def available?
      available
    end

    def service_of?(api_type)
      Array(api_type).include?(service_type.to_sym)
    end

    def merge!(values)
      values.each{ |k, v| self[k] = v }
    end

    def primary?
      fallback.present?
    end

    def fallback?
      primary.present?
    end

    # if self is a fallback vehicle, need to use it's primary counterpart vehicle_ids
    # so that travel rules depending on them can work correctly
    def vehicle_ids
      fallback? ? primary.vehicle_ids : super
    end

    def to_h
      super.slice(
        :name,
        :value,
        :quote_id,
        :price,
        :eta,
        :available,
        :reason,
        :earliest_available_in,
        :service_type,
        :region_id,
        :supplier,
        :supports_driver_message,
        :supports_flight_number,
        :estimate_id
      )
    end
  end
end
