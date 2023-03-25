class External::BookingsController < External::BaseController
  include Shared::BookingsController
  include Shared::BookingsController::Deprecated

  COMPANY_SCOPE_ACTIONS = %w(index create vehicles).freeze

  around_action :with_user_context

  rescue_from ::Bookings::ServiceProviderError do |error|
    render json: {errors: error.message}, status: :service_unavailable
  end

  def index
    render json: External::Bookings::Index.new(query: query_params).execute.result
  end

  def show
    render json: Bookings::Show.new(booking: booking).execute.result
  end

  def create
    service = External::Bookings::Create.new(params: booking_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = External::Bookings::Modify.new(booking: booking, params: booking_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def booking
    @booking ||= current_company.bookings_dataset.with_pk!(params[:id])
  end

  private def cancellation_service
    @cancellation_service ||= Bookings::Cancel.new(booking: booking, params: {})
  end

  private def current_member
    return @current_member if defined?(@current_member)

    if master_token_authorization? && !company_scope_action?
      @current_member = Booking.with_pk!(params[:id])&.company&.admin
    else
      super
    end
  end

  private def current_company
    return @current_company if defined?(@current_company)

    if master_token_authorization? && company_scope_action?
      @current_company = Company.with_pk!(params[:company_id])
    else
      super
    end
  end

  private def master_token_authorization?
    current_user.back_office?
  end

  private def company_scope_action?
    action_name.in?(COMPANY_SCOPE_ACTIONS)
  end
end
