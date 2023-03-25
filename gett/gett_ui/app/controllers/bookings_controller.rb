class BookingsController < ApplicationController
  include Shared::BookingsController
  include HomePrivacy::ControllerHelpers

  def index
    render json: Bookings::Index.new(query: query_params).execute.result
  end

  def show
    render json: Bookings::Show.new(booking: booking).execute.result
  end

  def update
    service = ::Bookings::Modify.new(booking: booking, params: booking_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def rate
    service = Bookings::Rate.new(booking: booking, params: rate_params)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def export
    send_data(
      Bookings::Export.new(query: query_params).execute.result,
      filename: 'bookings.csv',
      type: 'text/csv'
    )
  end

  def products
    service = Gett::Products.new(address: products_params)

    if service.execute.success?
      render json: service.normalized_response
    else
      head :not_found
    end
  end

  def cancellation_reason
    service = Bookings::CancellationReason.new(booking: booking, reason: params[:cancellation_reason])

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  private def booking_params
    super.tap do |params|
      restore_address_params!(params[:pickup_address])
      restore_address_params!(params[:destination_address])
    end
  end

  private def products_params
    params.permit(:latitude, :longitude)
  end

  private def cancellation_params
    params.permit(:cancel_schedule)
  end

  private def rate_params
    params.permit(:rating, rating_reasons: [])
  end

  private def booking
    @booking ||= current_company.bookings_dataset.with_pk!(params[:id])
  end

  private def new_booking_service
    @new_booking_service ||= Bookings::Form.new
  end

  private def form_details_service
    @form_details_service ||=
      ::Bookings::FormDetails.new(
        data_params: data_params,
        booking_params: booking_params
      )
  end

  private def repeat_booking_service
    @repeat_booking_service ||= Bookings::Repeat.new(booking: booking)
  end

  private def edit_booking_service
    @edit_booking_service ||= Bookings::Form.new(booking: booking)
  end

  private def cancellation_service
    @cancellation_service ||= Bookings::Cancel.new(booking: booking, params: cancellation_params)
  end
end
