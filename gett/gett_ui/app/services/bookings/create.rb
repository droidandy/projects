module Bookings
  class Create < Shared::Bookings::Create
    include ApplicationService::Context

    def show_result
      HomePrivacy.with_sanitize(context.member&.id != booking.passenger_id) do
        super
      end
    end

    private def show_service
      ::Bookings::Show.new(booking: result)
    end
  end
end
