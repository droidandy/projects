class BookingFeedbacksController < ApplicationController
  def create
    service = Feedbacks::Create.new(booking: booking, params: feedback_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def booking
    @booking ||= current_company.bookings_dataset.with_pk!(params[:booking_id])
  end

  private def feedback_params
    params.require(:feedback).permit(:rating, :message)
  end
end
