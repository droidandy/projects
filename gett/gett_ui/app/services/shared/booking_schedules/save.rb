class Shared::BookingSchedules::Save < ApplicationService
  include ApplicationService::ModelMethods

  attributes :schedule, :params, :booking_params

  def execute!
    save_model(schedule, validated_params)
  end

  def schedule
    @schedule ||= attributes[:schedule] || BookingSchedule.new
  end

  private def validated_params
    service = ::Bookings::ScheduleValidator.new(
      scheduled_ats: params[:scheduled_ats],
      vehicle_value: booking_params[:vehicle_value],
      passenger_id: booking_params[:passenger_id],
      pickup_address: booking_params[:pickup_address],
      destination_address: booking_params[:destination_address]
    )

    params.merge(scheduled_ats: service.execute.result[:available_scheduled_ats])
  end
end
