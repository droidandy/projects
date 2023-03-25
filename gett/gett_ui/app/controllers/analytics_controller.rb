class AnalyticsController < ApplicationController
  def event
    service = Gett::Analytics::PostEvent.new(event: event_params)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  private def event_params
    params.require(:event)
      .permit(
        :name,
        properties: [
          :company_id,
          :company_name,
          :booker_name,
          :user_id,
          :booker_id,
          :travel_rule_id,
          :order_id,
          :i_am_the_passenger,
          :passenger_name,
          :passenger_phone,
          :international_booking,
          :as_directed,
          :pickup_address,
          :pickup_lat,
          :pickup_lng,
          :pickup_type,
          :destination_address,
          :destination_lat,
          :destination_lng,
          :destination_type,
          :est_journey_type,
          :est_distance,
          :class_name,
          :class_eta,
          :class_pricing,
          :schedule_type,
          :scheduled_for,
          :message,
          :trip_reason,
          :payment_method,
          :flight_number,
          :ordering_user_id,
          :ordered_for_user_id,
          :new_status,
          :timestamp,
          :employees_added_successfully,
          :employees_updated_successfully,
          :employees_rejected,
          data: [:name, :address, :pickup_message, :destination_message],
          stop_points: [:name, :phone, :passenger_id, address: [:postal_code, :lat, :lng, :line, :country_code, :city, :region, :airport_iata]]
        ]
      )
  end
end
