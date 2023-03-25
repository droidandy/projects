module Bookings
  class References < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    delegate :company, to: :context
    attributes :booking_id

    def self.policy_class
      Bookings::FormPolicy
    end

    def execute!
      company.booking_references_dataset.active.map do |reference|
        reference.as_json(only: [:id, :name, :dropdown, :cost_centre, :conditional, :mandatory]).tap do |j|
          if booking.present?
            booker_reference = booking.booker_references.find{ |br| br.booking_reference_name == reference.name }
            j['value'] = booker_reference&.value
          end
        end
      end
    end

    private def booking
      return @booking if defined? @booking

      @booking = company.bookings_dataset[booking_id.to_i]
    end
  end
end
