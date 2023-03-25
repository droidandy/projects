module Shared::Bookings
  class Show < ApplicationService
    include HomePrivacy::AddressHelpers

    attributes :booking

    delegate :company, :driver, :cancelled_by, :cancelled_through_back_office, :vendor_name,
      :supplier_service_id, :service_type, :phone_booking?, to: :booking

    def execute!
      booking_data.merge(
        order_id: booking.order_id,
        passenger: booking.passenger_info[:full_name],
        passenger_avatar_url: booking.passenger&.avatar&.url,
        phone: booking.passenger_info[:phone_number],
        pickup_address: pickup_address,
        destination_address: destination_address,
        stop_addresses: stop_addresses,
        vehicle_type: booking.vehicle.name,
        booker: phone_booking? ? 'Customer Care' : booking.booker.full_name,
        booker_phone: phone_booking? ? nil : booking.booker.phone,
        booker_avatar_url: phone_booking? ? nil : booking.booker.avatar&.url,
        travel_reason: booking.travel_reason&.name || 'Other',
        references: references_data,
        payment_method_title: payment_method_title,
        channel: Faye.channelize(booking),
        final: booking.final?,
        driver_details: driver_details,
        path: path,
        cancelled_by_name: cancelled_by_name,
        events: events,
        company_type: company.company_type,
        can: {
          cancel: booking.cancellable?,
          repeat: booking.final?
        },
        via: vehicle_provider,
        alert_level: alert_level,
        alerts: alerts_data,
        rating_reasons: BookingDriver::RATING_REASONS,
        vendor_name: vendor_name,
        vendor_id: vendor_id,
        vendor_phone: vendor_phone
      )
    end

    private def vehicle_provider
      if booking.via?
        'via'
      else
        service_type
      end
    end

    private def booking_data
      data = booking.as_json(
        only: [
          :id,
          :service_id,
          :booker_id,
          :passenger_id,
          :message,
          :flight,
          :room,
          :status,
          :payment_method,
          :scheduled_at,
          :asap,
          :travel_distance,
          :fare_quote,
          :recurring_next
        ],
        include: %i(
          service_type message_to_driver indicated_status timezone journey_type message_from_supplier otp_code
        )
      )
      data['total_cost'] = booking.charges&.total_cost if booking.billable?
      data
    end

    private def payment_method_title
      booking.payment_method&.humanize
    end

    private def stop_addresses
      booking.stop_addresses.map do |address|
        address.as_json(only: address_json_fields).tap do |json|
          json[:name] = address[:stop_info]['name']
          json[:phone] = address[:stop_info]['phone']
        end
      end
    end

    private def driver_details
      return {info: {vehicle: {}}} if driver.blank? || driver.info_is_blank?

      result = {
        info: {
          name:         driver_name,
          rating:       driver.rating,
          vehicle:      driver.vehicle,
          image_url:    driver.image_url,
          phone_number: driver.phone_number,
          phv_license:  driver.phv_license
        },
        trip_rating: driver.trip_rating,
        location: driver.location,
        distance: driver.distance_details || {},
        pickup_distance: driver.pickup_distance || 0
      }
      result[:eta] = (driver.eta.to_i > 0) ? driver.eta.to_s : '< 1' if driver.eta.present?
      result
    end

    private def driver_name
      driver.name.present? ? I18n.transliterate(driver.name, locale: :en) : 'N/A'
    end

    private def references_data
      booking.booker_references.as_json(only: [:value], include: [:booking_reference_name])
    end

    private def path
      return driver.in_progress_path_points if driver&.in_progress_path_points.present?
      return booking_path_points if booking.final? && booking.destination_address.present?

      []
    end

    private def booking_path_points
      path_points = [[booking.pickup_address.lat, booking.pickup_address.lng]]

      booking.stop_addresses&.each do |address|
        path_points << [address.lat, address.lng]
      end

      path_points << [booking.destination_address.lat, booking.destination_address.lng]
      path_points
    end

    private def pickup_address
      safe_address_as_json(booking.pickup_address, skip_sanitize: skip_sanitize, only: address_json_fields)
    end

    private def destination_address
      safe_address_as_json(booking.destination_address, skip_sanitize: skip_sanitize, only: address_json_fields)
    end

    private def skip_sanitize
      false
    end

    private def address_json_fields
      [:id, :line, :lat, :lng, :city, :region, :postal_code, :country_code, :timezone]
    end

    private def events
      ::Bookings::Events.new(booking: booking).execute.result
    end

    private def alert_level
      return 'critical' if alerts.any?(&:critical?)
      return 'medium' if alerts.any?(&:medium?)
    end

    private def alerts_data
      alerts.map do |alert|
        { id: alert.id, level: alert.level, text: I18n.t("alerts.types.#{alert.type}"), type: alert.type }
      end
    end

    private def alerts
      @alerts ||=
        booking.alerts.reject do |alert|
          alert.resolved || (booking.customer_care? && alert.type == 'has_no_driver')
        end
    end

    private def cancelled_by_name
      if cancelled_by.present?
        cancelled_through_back_office ? 'Customer Care' : cancelled_by.full_name
      end
    end

    private def vendor_id
      "ID: #{supplier_service_id}" if supplier_service_id.present?
    end

    # Show service is used to render single booking details, and is not supposed to be
    # used in services that deal with multiple orders (such as Bookings::Index). Thus,
    # it's kinda OK not to have preloading capabilities here to keep things simple.
    private def vendor_phone
      if booking.ot?
        VehicleVendor.where(name: vendor_name).get(:phone)
      else
        case vendor_name
        when ::Bookings::Vendors::GETT_UK
          company.ddi.phone
        when ::Bookings::Vendors::GET_E
          Settings.get_e.vendor_phone
        when ::Bookings::Vendors::GETT_RU
          Settings.gett_ru.vendor_phone
        when ::Bookings::Vendors::GETT_IL
          Settings.gett_il.vendor_phone
        end
      end
    end
  end
end
