class Bookings::Form < ApplicationService
  include ApplicationService::Policy
  include ApplicationService::Context

  attributes :booking
  delegate :company, :member, to: :context
  delegate :can_change_details?, to: :form_service
  delegate :select_passenger?, to: :policy

  def execute!
    return unless form_service.execute.success?

    form_service.result.tap do |data|
      data[:can] = {
        select_passenger: can_change_details? && select_passenger?,
        change_vehicle_count: form_service.can_change_vehicle_count? && policy.change_vehicle_count?,
        change_references: can_change_details?
      }

      if can_change_details? && select_passenger?
        data[:passengers] = form_service.passengers_data
      else
        data[:passengers] = [passenger_data].compact
        data[:passenger] = passenger_data
      end

      data[:vehicles_available_in] = vehicles_available_in if company.affiliate?
    end
  end

  private def form_service
    @form_service ||= Shared::Bookings::Form.new(
      booking: booking,
      member: member,
      company: company,
      back_office: false,
      passengers_dataset: policy_scope(:passengers),
      allow_personal_cards: false,
      repeating_booking: is_a?(Bookings::Repeat),
      reversing_booking: is_a?(Bookings::Reverse),
      details_editable_due_status: false
    )
  end

  private def passenger_data
    return @passenger_data if defined?(@passenger_data)

    passenger = booking.nil? ? member : booking.passenger
    @passenger_data = passenger.presence && form_service.passenger_data(passenger)
  end

  private def vehicles_available_in
    Hash[Vehicle.where(name: Bookings::AFFILIATE_VEHICLES).pluck(:name, :earliest_available_in)]
  end
end
