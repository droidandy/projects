module Mobile::V1
  class SmsMessagesController < ApplicationController
    def notify_driver
      service = ::Bookings::NotifyDriver.new(booking: booking, arrive_in: params[:arrive_in])

      if service.execute.success?
        head :ok
      else
        head :bad_request
      end
    end

    private def booking
      @booking ||= Booking.with_pk!(params[:booking_id])
    end
  end
end
