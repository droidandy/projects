class Admin::BookingMessagesController < Admin::BaseController
  def create
    service = Admin::BookingMessages::Create.new(booking: booking, text: params[:text], phones: params[:phones])

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def booking
    @booking ||= Booking.with_pk(params[:booking_id])
  end
end
