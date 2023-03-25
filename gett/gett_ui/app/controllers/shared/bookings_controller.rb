module Shared::BookingsController
  def form_details
    render json: form_details_service.execute.result
  end

  def new
    render json: new_booking_service.execute.result
  end

  def create
    service = ::Bookings::Create.new(params: booking_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def edit
    render json: edit_booking_service.execute.result
  end

  def repeat
    if repeat_booking_service.execute.success?
      render json: repeat_booking_service.result
    else
      head :not_found
    end
  end

  def cancel
    if cancellation_service.execute.success?
      render json: cancellation_service.booking_data
    else
      render json: {errors: cancellation_service.errors}, status: :unprocessable_entity
    end
  end

  def validate_references
    service = ::Bookings::ReferencesProcessor.new(params: references_params, validate_value: true)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def references
    render json: ::Bookings::References.new(booking_id: params[:booking_id]).execute.result
  end

  private def query_params
    params.permit(
      :page, :order, :reverse, :search, :final,
      :not_final, :from, :to, :map_size,
      :booking_id,
      ids: [],
      status: [],
      payment_method: [],
      vehicle_types: [],
      include_passenger_ids: [],
      exclude_passenger_ids: []
    )
  end

  private def data_params
    params.permit(
      :request_vehicles,
      :request_scheduled_ats,
      :request_payment_types,
      :preserve_scheduled_ats,
      :preserve_payment_type
    )
  end

  private def booking_params
    address_fields = %i(
      postal_code lat lng line country_code timezone city region
      street_name street_number point_of_interest airport_iata airport
    )

    params
      .require(:booking)
      .permit(
        :vehicle_value,
        :vehicle_price,
        :vehicle_name, # is not used directly
        :vehicle_touched,
        :vehicle_vendor_id,
        :quote_id,
        :region_id,
        :supplier,
        :supports_flight_number,
        :supports_driver_message,
        :estimate_id,
        :message,
        :room,
        :reason,
        :flight,
        :international_flag,
        :passenger_id,
        :passenger_name,
        :passenger_phone,
        :travel_reason_id,
        :scheduled_at,
        :scheduled_type,
        :payment_method,
        :payment_card_id,
        :payment_type, # is not used directly
        :vehicle_count,
        :as_directed,
        :source_type,
        :journey_type,
        :critical_flag,
        special_requirements: [],
        pickup_address: [:id, *address_fields],
        destination_address: [:id, *address_fields],
        stops: [:name, :phone, :passenger_id, address: address_fields],
        booker_references: [:value, :booking_reference_id],
        schedule: [
          :custom, :preset_type, :starting_at, :ending_at, :workdays_only,
          :recurrence_factor, weekdays: [], scheduled_ats: []
        ]
      )
      .tap do |data|
        data[:pickup_address][:airport_iata] ||= data[:pickup_address].delete(:airport) if data[:pickup_address]&.key?(:airport)
        data[:destination_address][:airport_iata] ||= data[:destination_address].delete(:airport) if data[:destination_address]&.key?(:airport)
        data[:stops]&.each{ |stop| stop[:address][:airport_iata] ||= stop[:address].delete(:airport) if stop[:address]&.key?(:airport) }
      end
  end

  private def references_params
    params.require(:booker_references)
      .map{ |params| params.permit(:value, :booking_reference_id) }
  end

  private def form_details_service
    fail "#{self.class.name} does not implement #{__method__}"
  end

  private def cancellation_service
    fail "#{self.class.name} does not implement #{__method__}"
  end

  private def new_booking_service
    fail "#{self.class.name} does not implement #{__method__}"
  end

  private def repeat_booking_service
    fail "#{self.class.name} does not implement #{__method__}"
  end

  private def reverse_booking_service
    fail "#{self.class.name} does not implement #{__method__}"
  end

  private def edit_booking_service
    fail "#{self.class.name} does not implement #{__method__}"
  end

  module Deprecated
    def vehicles
      service = ::Bookings::Vehicles.new(company: current_company, params: vehicles_params)

      if service.execute.success?
        render json: service.result
      else
        head :not_found
      end
    end

    private def vehicles_params
      params
        .permit(
          :passenger_id,
          :passenger_name,
          :passenger_phone,
          :scheduled_at,
          :scheduled_type,
          :payment_method,
          :payment_card_id,
          :as_directed,
          pickup_address: [:postal_code, :lat, :lng, :line, :country_code, :timezone, :city, :region, :airport, :street_name, :street_number, :point_of_interest],
          destination_address: [:postal_code, :lat, :lng, :line, :country_code, :timezone, :city, :region, :airport, :street_name, :street_number, :point_of_interest],
          stops: [:name, :phone, address: [:postal_code, :lat, :lng, :line, :country_code, :city, :region, :airport, :street_name, :street_number, :point_of_interest]]
        )
        .tap do |data|
          data[:pickup_address][:airport_iata] = data[:pickup_address].delete(:airport)
          data[:destination_address][:airport_iata] = data[:destination_address].delete(:airport) if data[:destination_address].present?
          data[:stops]&.each{ |stop| stop[:address][:airport_iata] = stop[:address].delete(:airport) }
        end
    end
  end
end
