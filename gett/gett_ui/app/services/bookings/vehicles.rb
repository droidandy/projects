module Bookings
  class Vehicles < ApplicationService
    include ApplicationService::CurrencyHelpers

    attributes :company, :params, :with_manual, :only
    delegate :quote_price_increase_percentage, :quote_price_increase_pounds, :price_with_fx_rate_increase, to: :company

    def execute!
      # TravelRules::VehicleAvailability will mutate vehicles array, disallowing ones that
      # are not available via travel policy or not returned by service provider API
      service = TravelRules::VehicleAvailability.new(vehicles: vehicles, params: params, with_manual: with_manual)
      service.execute do |allowed_services|
        request_vehicles(allowed_services)
        process_vehicles!
      end

      {
        vehicles: vehicles_data,
        distance: distance,
        duration: duration,
        booking_fee: company.booking_fee
      }
    end

    private def vehicles_data
      vehicles.map do |vehicle|
        vehicle.to_h.tap do |h|
          h[:description] = vehicle_description(vehicle)
          h[:details] = vehicle_details(vehicle)
          h[:via] = vehicle_provider(vehicle)
          h[:prebook] = vehicle_prebook?(vehicle)

          if h[:price].present?
            price_with_rule = pricing_rule_price(h[:name])
            h[:price] = price_with_rule.presence || price_with_fx_rate_increase(h[:price], international: international?)

            h[:trader_price] = trader_price(h[:price]) if trader_price_applicable?

            if local_currency_applicable?
              h[:local_price] = convert_currency_by_country_code(amount: h[:price], to: country_code)
              h[:local_currency_symbol] = currency_symbol(country_code)
            end
          end
        end
      end
    end

    private def vehicle_description(vehicle)
      case vehicle.name
      when 'BlackTaxi', 'OTBlackTaxi', 'BlackTaxiXL', 'OTBlackTaxiXL'
        I18n.t('vehicles.description.BlackTaxi')
      when 'Standard', 'GettExpress', 'Economy', 'Business'
        I18n.t('vehicles.description.Standard')
      when 'MPV', 'GettXL', 'StandardXL'
        I18n.t('vehicles.description.MPV')
      when 'Exec', 'Courier', 'BabySeat', 'Wheelchair'
        I18n.t("vehicles.description.#{vehicle.name}")
      else
        ''
      end
    end

    private def vehicle_details(vehicle)
      if company&.bbc?
        return [] if params[:international_flag]

        return I18n.t('vehicles.details.bbc')
      end

      case vehicle.name
      when 'BlackTaxi', 'OTBlackTaxi', 'BlackTaxiXL', 'OTBlackTaxiXL', 'Wheelchair'
        I18n.t('vehicles.details.BlackTaxi')
      when 'GettXL', 'Economy', 'StandardXL', 'Business'
        I18n.t("vehicles.details.GettXL")
      when 'Standard', 'GettExpress', 'Exec', 'MPV', 'Courier', 'Special', 'BabySeat'
        I18n.t("vehicles.details.#{vehicle.name}")
      else
        []
      end
    end

    private def vehicle_provider(vehicle)
      if via_provider?(vehicle)
        'via'
      else
        vehicle.service_type
      end
    end

    private def vehicle_prebook?(vehicle)
      asap? &&
        domestic? &&
        !vehicle.available? &&
        ((vehicle.name.in?(%w(Standard Exec MPV)) && vehicle.ot?) || via_provider?(vehicle))
    end

    private def request_vehicles(allowed_services)
      ActiveSupport::Dependencies.interlock.permit_concurrent_loads do
        @vehicle_services =
          Bookings::API_TYPES.values.map do |api_type|
            "#{api_type}::Vehicles".constantize.new(
              company: company,
              attrs: vehicles_params,
              allowed_services: allowed_services
            )
          end

        all_services =
          @vehicle_services.map do |api_service|
            if api_service.can_execute?
              Thread.new{ fail_safe(silence: true){ api_service.execute } }
            end
          end
        all_services << request_distance if allowed_services.any?
        all_services.select(&:present?).each(&:join)
      end
    end

    private def process_vehicles!
      requested_vehicles = @vehicle_services.flat_map(&:as_vehicles)
      vehicles.each do |vehicle|
        api_result = requested_vehicles.select{ |r| vehicle.values.include?(r[:value]) }.min_by{ |r| r[:price] }
        next if api_result.blank?

        vehicle.merge!(api_result)
        vehicle.merge!(eta: "< #{vehicle.pre_eta}") if vehicle.eta.blank?
      end
    end

    private def request_distance
      Thread.new{ fail_safe{ find_distance.execute } }
    end

    private def find_distance
      @find_distance ||= Bookings::TravelDistanceCalculator.new(
        pickup: pickup,
        stops: stops,
        destination: destination
      )
    end

    private def pickup
      params[:pickup_address].slice(:lat, :lng)
    end

    private def stops
      Array(params[:stops]).map do |stop|
        stop[:address].slice(:lat, :lng)
      end
    end

    private def destination
      params[:destination_address]&.slice(:lat, :lng)
    end

    private def distance
      return unless find_distance.success?

      distance = find_distance.result[:distance]
      if distance < 1
        "#{(distance * BookingDriver::FEET_IN_MILE).round} feet"
      else
        "#{distance} miles"
      end
    end

    private def duration
      "#{find_distance.result[:duration]} minutes" if find_distance.success?
    end

    private def vehicles
      @vehicles ||= Bookings::Vehicle.all.select{ |v| only.nil? || only.include?(v.name) }
    end

    private def scheduled_at
      time =
        if asap?
          Time.current + Bookings::ASAP_DELAY
        else
          params[:scheduled_at].to_time
        end

      time.in_time_zone(params.dig(:pickup_address, :timezone))
    end

    private def asap?
      params[:scheduled_at].blank? || params[:scheduled_type] == 'now'
    end

    private def domestic?
      ::Bookings.domestic?(country_code)
    end

    private def international?
      ::Bookings.international?(country_code)
    end

    private def via_provider?(vehicle)
      asap? && domestic? && vehicle.gett? && vehicle.name == 'Standard'
    end

    private def vehicles_params
      params.slice(
        :passenger_id,
        :passenger_name,
        :passenger_phone,
        :pickup_address,
        :destination_address,
        :stops,
        :scheduled_type
      ).tap do |json|
        json[:scheduled_at] = scheduled_at.to_datetime
        json[:later] = params[:scheduled_at].present?
      end
    end

    private def local_currency_applicable?
      country_code.present? && country_code != Bookings::DEFAULT_CURRENCY_COUNTRY_CODE
    end

    private def country_code
      params.dig(:pickup_address, :country_code)
    end

    private def trader_price_applicable?
      quote_price_increase_percentage > 0 || quote_price_increase_pounds > 0
    end

    private def trader_price(price)
      (price * (1 + quote_price_increase_percentage / 100) + quote_price_increase_pounds * 100).to_i
    end

    private def pricing_rule_price(vehicle_type)
      return if !find_distance.success? || params[:as_directed]

      PricingRules::CalculatePrice.new(
        company: company,
        vehicle_type: vehicle_type,
        pickup: params[:pickup_address].slice(:lat, :lng),
        destination: params[:destination_address].slice(:lat, :lng),
        distance: find_distance.result[:distance],
        has_stops: params[:stops].present?,
        asap: asap?,
        scheduled_at: scheduled_at
      ).execute.result
    end
  end
end
