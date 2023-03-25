class Admin::Bookings::Form < ApplicationService
  include ApplicationService::Context

  attributes :booking, :company, :repeat
  delegate :can_change_details?, to: :form_service

  EDITABLE_DETAILS_STATUSES = %w'customer_care processing completed cancelled rejected'.freeze

  def execute!
    return unless form_service.execute.success?

    form_service.result.tap do |data|
      data[:can] = {
        select_preferred_vendor: true,
        select_passenger: can_change_details?,
        select_booker: false,
        change_vehicle_count: form_service.can_change_vehicle_count?,
        change_references: can_change_details?
      }

      data[:passenger] = passenger_data

      if can_change_details?
        data[:passengers] = form_service.passengers_data
        data[:bookers] = bookers_data
      else
        data[:passengers] = [passenger_data]
      end
    end
  end

  private def form_service
    @form_service ||= Shared::Bookings::Form.new(
      booking: booking,
      company: booking_company,
      passengers_dataset: booking_company.passengers_dataset,
      back_office: true,
      allow_personal_cards: true,
      repeating_booking: repeat,
      details_editable_due_status: editable_details_status?
    )
  end

  private def booking_company
    company || booking.company
  end

  private def editable_details_status?
    booking&.status&.in?(EDITABLE_DETAILS_STATUSES)
  end

  private def bookers_data
    booking_company.bookers_dataset
      .active
      .all
      .as_json(only: [:id, :first_name, :last_name])
  end

  private def passenger_data
    return @passenger_data if defined?(@passenger_data)

    passenger = booking&.passenger

    @passenger_data =
      if passenger.present?
        form_service.passenger_data(passenger).merge(
          phone_number: booking.passenger_info[:phone_number]
        )
      else
        booking&.passenger_info
      end
  end
end
