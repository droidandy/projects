class Admin::BookingPricingController < Admin::BaseController
  def show
    render json: Admin::Bookings::PricingForm.new(booking: booking).execute.result
  end

  def update
    service = Admin::Bookings::PricingUpdate.new(booking: booking, params: pricing_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def pricing_params
    params.require(:pricing).permit(
      booking: [
        :status,
        :booker_id
      ],
      charges: [
        :fare_cost,
        :paid_waiting_time_fee,
        :handling_fee,
        :booking_fee,
        :phone_booking_fee,
        :tips,
        :stops_fee,
        :additional_fee,
        :extra_1,
        :extra_2,
        :extra_3,
        :run_in_fee,
        :international_booking_fee,
        :cancellation_fee
      ]
    )
  end

  private def booking
    @booking ||= Booking.with_pk(params[:booking_id])
  end

  private def charges
    booking.charges
  end
end
