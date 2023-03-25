module Mobile::V1
  class BookingsController < ApplicationController
    include Shared::BookingsController
    include Shared::BookingsController::Deprecated
    include HomePrivacy::ControllerHelpers

    def index
      render json: ::Bookings::Index.new(query: query_params).execute.result
    end

    def show
      render json: Bookings::Show.new(booking: booking).execute.result
    end

    def create
      service = Bookings::Create.new(params: booking_params)

      if service.execute.success?
        render json: service.show_result
      else
        render json: {errors: service.errors}, status: :unprocessable_entity
      end
    end

    def update
      service = ::Bookings::Modify.new(booking: booking, params: booking_params)

      if service.execute.success?
        render json: service.show_result
      else
        render json: {errors: service.errors}, status: :unprocessable_entity
      end
    end

    def cancellation_reason
      service = ::Bookings::CancellationReason.new(booking: booking, reason: params[:cancellation_reason])

      if service.execute.success?
        head :ok
      else
        head :unprocessable_entity
      end
    end

    def rate
      service = ::Bookings::Rate.new(booking: booking, params: rate_params)

      if service.execute.success?
        head :ok
      else
        head :unprocessable_entity
      end
    end

    def reverse
      if reverse_booking_service.execute.success?
        render json: reverse_booking_service.result
      else
        head :not_found
      end
    end

    private def booking_params
      super.tap do |params|
        restore_address_params!(params[:pickup_address])
        restore_address_params!(params[:destination_address])
      end
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

    private def repeat_booking_service
      @repeat_booking_service ||= ::Bookings::Repeat.new(booking: booking)
    end

    private def reverse_booking_service
      @reverse_booking_service ||= ::Bookings::Reverse.new(booking: booking)
    end

    private def new_booking_service
      @new_booking_service ||= ::Bookings::Form.new
    end

    private def cancellation_service
      @cancellation_service ||= ::Bookings::Cancel.new(booking: booking, params: cancellation_params)
    end

    private def form_details_service
      @form_details_service ||=
        Bookings::FormDetails.new(
          data_params: data_params,
          booking_params: booking_params
        )
    end

    private def edit_booking_service
      @edit_booking_service ||= ::Bookings::Form.new(booking: booking)
    end
  end
end
