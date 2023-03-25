# Service for processing of booking attributes for BBC company
#
# Basic terms:
# ww - Work to Work ride
# wh - Work to Home ride
# hw - Home to Work ride
# p11d - https://en.wikipedia.org/wiki/P11D
# lnemt - Late Night and Early Moning Time (setup on Passenger profile page)
# limit - Mileage Limit (setup on Company settings page)
#
module Bookings::FormProcessors
  class Bbc < Base
    attributes :vehicles_data

    delegate :home_address, :work_address,
      :exemption_p11d, :exemption_ww_charges, :exemption_wh_hw_charges, :mileage_limit, to: :passenger
    delegate :excess_cost_per_mile, :booking_fee, to: :company

    def execute!
      catch(:abort) do
        if international?
          apply_international_rules
          break
        end

        apply_freelancer_rules if passenger.blank? || passenger.bbc_freelancer?
        apply_staff_rules if passenger&.bbc_staff?
      end

      super
    end

    private def apply_freelancer_rules
      fix_journey_type

      update_cost_calculations! do |vehicle, vehicle_price|
        vehicle.merge!(bbc_total_cost: vehicle_price)
      end
    end

    private def apply_staff_rules
      check_pd

      throw :abort if pickup_address.blank? || destination_address.blank?

      apply_temp_rules if passenger.bbc_temp?
      apply_thin_rules if passenger.bbc_thin?
      apply_full_rules if passenger.bbc_full?
    end

    private def apply_international_rules
      booking_params[:journey_type] = Booking::BBC::JourneyType::WW

      update_cost_calculations! do |vehicle, vehicle_price|
        vehicle.merge!(
          bbc_total_cost_to_bbc: vehicle_price,
          bbc_salary_charge: 0,
          bbc_p11_tax: 0
        )
      end
    end

    ## TEMP PD RULES

    private def apply_temp_rules
      fix_journey_type

      if inside_limit?
        update_cost_calculations! do |vehicle, vehicle_price|
          vehicle.merge!(bbc_total_cost: vehicle_price)
        end
      end

      add_excess_mileage_error if outside_limit?
    end

    ## THIN PD RULES

    private def apply_thin_rules
      fix_journey_type

      apply_with_ww_exemption    if exemption_ww_charges
      apply_with_no_ww_exemption unless exemption_ww_charges
    end

    # FULL PD RULES

    private def apply_full_rules
      fix_journey_type

      apply_ww_full_rules    if ww_ride?
      apply_wh_hw_full_rules unless ww_ride?
    end

    private def apply_ww_full_rules
      apply_with_ww_exemption    if exemption_ww_charges
      apply_with_no_ww_exemption unless exemption_ww_charges
    end

    private def apply_with_ww_exemption
      if inside_limit? || outside_limit?
        update_cost_calculations! do |vehicle, vehicle_price|
          vehicle.merge!(bbc_total_cost: vehicle_price)
        end
      end
    end

    private def apply_with_no_ww_exemption
      if inside_limit?
        update_cost_calculations! do |vehicle, vehicle_price|
          vehicle.merge!(bbc_total_cost: vehicle_price)
        end
      end

      if outside_limit?
        add_excess_mileage_alert
        add_outside_limit_email

        update_cost_calculations! do |vehicle, vehicle_price|
          vehicle.merge!(
            bbc_total_cost: vehicle_price - excess_mileage_cost,
            bbc_salary_charge: excess_mileage_cost
          )
        end
      end
    end

    private def apply_wh_hw_full_rules
      return apply_with_no_whhw_no_p11d_exemption if !exemption_wh_hw_charges && !exemption_p11d
      return apply_with_whhw_no_p11d_exemption    if exemption_wh_hw_charges && !exemption_p11d
      return apply_witn_whhw_p11d_exemption       if exemption_wh_hw_charges && exemption_p11d
      return apply_witn_no_whhw_p11d_exemption    if !exemption_wh_hw_charges && exemption_p11d
    end

    private def apply_with_no_whhw_no_p11d_exemption
      if outside_lnemt?
        add_outside_lnemt_alert
        add_outside_lnemt_email

        update_cost_calculations! do |vehicle, vehicle_price|
          vehicle.merge!(bbc_salary_charge: vehicle_price)
        end
      end

      if inside_lnemt? && inside_limit?
        update_cost_calculations! do |vehicle, vehicle_price|
          vehicle.merge!(
            bbc_p11_tax: vehicle_price * p11d_ratio,
            bbc_total_cost_to_bbc: vehicle_price * (1 + p11d_ratio)
          )
        end
      end

      if inside_lnemt? && outside_limit?
        add_outside_limit_alert
        add_outside_limit_email

        update_cost_calculations! do |vehicle, vehicle_price|
          p11_tax = (vehicle_price - excess_mileage_cost) * p11d_ratio

          vehicle.merge!(
            bbc_p11_tax: p11_tax,
            bbc_total_cost: vehicle_price + p11_tax,
            bbc_salary_charge: excess_mileage_cost
          )
        end
      end
    end

    private def apply_with_whhw_no_p11d_exemption
      update_cost_calculations! do |vehicle, vehicle_price|
        vehicle.merge!(
          bbc_p11_tax: vehicle_price * p11d_ratio,
          bbc_total_cost_to_bbc: vehicle_price * (1 + p11d_ratio)
        )
      end
    end

    private def apply_witn_whhw_p11d_exemption
      update_cost_calculations! do |vehicle, vehicle_price|
        vehicle.merge!(bbc_total_cost: vehicle_price)
      end
    end

    private def apply_witn_no_whhw_p11d_exemption
      if outside_lnemt?
        add_outside_lnemt_alert
        add_outside_lnemt_email

        update_cost_calculations! do |vehicle, vehicle_price|
          vehicle.merge!(bbc_salary_charge: vehicle_price)
        end
      end

      if inside_lnemt? && inside_limit?
        update_cost_calculations! do |vehicle, vehicle_price|
          vehicle.merge!(bbc_total_cost: vehicle_price)
        end
      end

      if inside_lnemt? && outside_limit?
        add_outside_limit_alert
        add_outside_limit_email

        update_cost_calculations! do |vehicle, vehicle_price|
          vehicle.merge!(
            bbc_total_cost: vehicle_price - excess_mileage_cost,
            bbc_salary_charge: excess_mileage_cost
          )
        end
      end
    end

    private def add_outside_lnemt_alert
      add_alert(:base, t('outside_lnemt_alert'))
    end

    private def add_outside_limit_alert
      add_alert(:base, t('outside_limit_alert'))
    end

    private def add_excess_mileage_alert
      add_alert(:base, t('excess_mileage_alert', mileage_limit: mileage_limit))
    end

    private def add_excess_mileage_error
      add_error(:base, t('excess_mileage_error', mileage_limit: mileage_limit))
    end

    private def add_outside_lnemt_email
      # TODO: temporary disable notifications by request from BBC
      # should be enabled after testing finish
      # metadata.merge!(
      #   ride_outside_lnemt_email: {
      #     lnemt_start: (wh_ride? ? passenger.wh_exemption_time_from : passenger.hw_exemption_time_from),
      #     lnemt_end: (wh_ride? ? passenger.wh_exemption_time_to : passenger.hw_exemption_time_to)
      #   }
      # )
    end

    private def add_outside_limit_email
      # TODO: temporary disable notifications by request from BBC
      # should be enabled after testing finish
      # metadata.merge!(
      #   ride_over_mileage_limit_email: {
      #     ww_ride: ww_ride?,
      #     excess_mileage: excess_mileage,
      #     excess_mileage_cost: excess_mileage_cost
      #   }
      # )
    end

    private def outside_lnemt?
      return @outside_lnemt if defined?(@outside_lnemt)

      formatted_booking_sheduled_at = scheduled_at.in_time_zone(pickup_address[:timezone]).strftime('%H:%M')

      exemption_from, exemption_to =
        if hw_ride?
          [passenger.hw_exemption_time_from, passenger.hw_exemption_time_to]
        else
          [passenger.wh_exemption_time_from, passenger.wh_exemption_time_to]
        end

      @outside_lnemt = !time_range_cover?(exemption_from, exemption_to, formatted_booking_sheduled_at)
    end

    private def time_range_cover?(range_time_from, range_time_to, time)
      return (range_time_from..range_time_to).cover?(time) if range_time_from <= range_time_to

      # when time_from > time_to, this means that we have times in different days
      (range_time_from..'23:59').cover?(time) || ('00:00'..range_time_to).cover?(time)
    end

    private def inside_lnemt?
      !outside_lnemt?
    end

    private def outside_limit?
      @outside_limit ||=
        ride_distance > mileage_limit
    end

    private def inside_limit?
      !outside_limit?
    end

    private def excess_mileage
      @excess_mileage ||= ride_distance - mileage_limit
    end

    private def excess_mileage_cost
      @excess_mileage_cost ||= (excess_mileage * excess_cost_per_mile * 100).round
    end

    private def check_pd
      return unless passenger.pd_expired?

      add_error(:base, t('no_passenger_declaration_found'))

      throw :abort
    end

    private def fix_journey_type
      return if booking_params[:journey_type] == Booking::BBC::JourneyType::WW

      catch(:journey_type_updated) do
        apply_address_declaration_alert
        apply_transport_station_alert
        apply_vias_alert
      end

      # after click HomeToWork button, UI sends `home_to_work` journey type
      # we should force change journey_type for nonFullPD passengers to WW
      unless passenger&.bbc_full?
        booking_params[:journey_type] = Booking::BBC::JourneyType::WW
      end
    end

    private def apply_address_declaration_alert
      addresses_fit =
        (hw_ride? && distance_between(pickup_address, home_address) <= 10 && distance_between(destination_address, work_address) <= 10) ||
        (wh_ride? && distance_between(pickup_address, work_address) <= 10 && distance_between(destination_address, home_address) <= 10)

      assign_ww_travel_reason(t('address_declaration_alert')) unless addresses_fit
    end

    private def apply_transport_station_alert
      pickup_address_airport_match =
        airport_location_match?(pickup_address&.slice(:lat, :lng))

      destination_address_airport_match =
        airport_location_match?(destination_address&.slice(:lat, :lng))

      if pickup_address_airport_match || destination_address_airport_match
        assign_ww_travel_reason(t('transport_station_alert'))
      end
    end

    private def apply_vias_alert
      return if booking_params[:stops].blank?

      assign_ww_travel_reason(t('vias_alert'))
    end

    private def assign_ww_travel_reason(alert)
      add_alert(:base, alert)
      booking_params[:journey_type] = Booking::BBC::JourneyType::WW
      throw :journey_type_updated
    end

    private def hw_ride?
      booking_params[:journey_type] == Booking::BBC::JourneyType::HW
    end

    private def wh_ride?
      booking_params[:journey_type] == Booking::BBC::JourneyType::WH
    end

    private def ww_ride?
      booking_params[:journey_type] == Booking::BBC::JourneyType::WW
    end

    private def ride_distance
      return @ride_distance if defined?(@ride_distance)

      @ride_distance =
        Bookings::TravelDistanceCalculator.new(pickup: pickup_address, destination: destination_address)
          .execute
          .result
          &.fetch(:distance, 0)
    end

    private def pickup_address
      booking_params[:pickup_address]
    end

    private def destination_address
      booking_params[:destination_address]
    end

    # returns distance in miles
    private def distance_between(from, to)
      from_location = Geokit::LatLng.new(*from.to_h.values_at(:lat, :lng))
      from_location.distance_to(to.to_h.values_at(:lat, :lng))
    end

    private def p11d_ratio
      # company.p11d stored in percents
      @p11d_ratio ||= company.p11d.to_i / 100.0
    end

    private def update_cost_calculations!
      return if vehicles_data.blank?

      vehicles_data[:vehicles].each do |vehicle|
        next if vehicle.fetch(:price, 0).zero?

        # for BBC companies we should include Company.booking_fee to total prices
        # for non-BBC we apply booking_fee only for invoice calculation
        # vehicle[:price] stored in pence, booking_fee in pounds
        vehicle_price = vehicle[:price] + booking_fee * 100

        yield(vehicle, vehicle_price)
      end
    end

    private def airport_location_match?(location)
      return if location.blank?

      Airport.closest(*location.values_at(:lat, :lng))&.present?
    end

    private def international?
      booking_params[:international_flag]
    end

    # TODO: move to generic service plugin
    private def t(key, *args)
      I18n.t("bookings.form_processors.bbc.#{key}", *args)
    end
  end
end
