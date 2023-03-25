module Gett
  class Vehicles < Base
    include ApplicationService::CurrencyHelpers

    http_method :get

    DEFAULT_DESTINATION = { lat: 51.604473, lng: -0.1120943 }.freeze # 221b Baker Street
    private_constant :DEFAULT_DESTINATION

    attributes :attrs, :allowed_services

    fetch_business_id_from { attrs.dig(:pickup_address, :country_code) }

    private def url
      super("/business/price")
    end

    private def params
      {
        pickup_latitude: attrs.dig(:pickup_address, :lat),
        pickup_longitude: attrs.dig(:pickup_address, :lng),
        destination_latitude: attrs.dig(:destination_address, :lat) || DEFAULT_DESTINATION[:lat],
        destination_longitude: attrs.dig(:destination_address, :lng) || DEFAULT_DESTINATION[:lng],
        business_id: business_id
      }.tap do |params|
        params[:scheduled_at] = attrs[:scheduled_at] if attrs[:scheduled_at].present?
      end
    end

    def execute!(&block)
      request_gett_etas
      request_via_eta
      super
    end

    def as_vehicles
      prices = (success? && response.data.with_indifferent_access[:prices]).presence || []
      prices.uniq.map{ |price| to_vehicle(price) }.compact
    end

    def can_execute?
      allowed_services.include?(:gett)
    end

    private def request_gett_etas
      fail_safe{ gett_eta.with_context(context).execute }
    end

    private def gett_eta
      @gett_eta ||= Gett::Eta.new(
        lat: attrs.dig(:pickup_address, :lat),
        lng: attrs.dig(:pickup_address, :lng),
        country_code: attrs.dig(:pickup_address, :country_code),
        company: company
      )
    end

    def normalized_response_gett_etas
      gett_eta.response.data.with_indifferent_access[:etas] || []
    end

    private def gett_etas
      @gett_etas ||=
        begin
          etas = gett_eta.success? ? normalized_response_gett_etas : []
          etas
            .uniq
            .map { |e| [e[:product_id], e[:eta]] }
            .to_h
        end
    end

    private def request_via_eta
      fail_safe{ via_eta_service.execute } if via_eta_applicable?
    end

    private def via_eta_service
      @via_eta_service ||= ::Gett::Via::Eta.new(
        pickup_address: attrs[:pickup_address],
        destination_address: attrs[:destination_address]
      )
    end

    private def via_eta_applicable?
      asap? && domestic?
    end

    private def asap?
      !attrs[:later]
    end

    private def domestic?
      ::Bookings.domestic?(attrs.dig(:pickup_address, :country_code))
    end

    private def via_eta
      via_eta_service.result
    end

    private def to_vehicle(price)
      vehicle = price_to_vehicle(price)
      if via_provider?(vehicle)
        via_eta_to_vehicle(vehicle)
      else
        vehicle
      end
    end

    private def via_provider?(vehicle)
      via_eta_applicable? && vehicle.present? && vehicle[:name] == 'Standard'
    end

    private def price_to_vehicle(price)
      vehicle = gett_vehicles_ids[price[:product_id]]
      return if vehicle.blank?

      vehicle = {
        value: vehicle.value,
        name: vehicle.name,
        supports_driver_message: true,
        supports_flight_number: true
      }
      eta = gett_etas[price[:product_id]]
      if eta.present?
        eta = (eta / 60).round
        vehicle[:eta] = (eta > 0) ? eta : '< 1'
      end
      vehicle[:price] = convert_currency(amount: price[:estimate], from: price[:currency]) * 100
      vehicle
    end

    private def gett_vehicles_ids
      @gett_vehicles_ids ||= ::Vehicle.gett.to_hash(:value)
    end

    private def via_eta_to_vehicle(vehicle)
      # reject vehicle if no response from Via
      vehicle.merge(eta: "< #{via_eta.zero? ? 1 : via_eta}") if via_eta.present?
    end
  end
end
