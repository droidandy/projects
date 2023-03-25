class BookingsServiceJob < ApplicationJob
  def perform(booking, service_klass)
    booker = booking.booker

    ApplicationService::Context.with_context(company: booker.company, user: booker) do
      service_klass.constantize.new(booking: booking).execute
    end
  end
end
