class Admin::BookingsController < Admin::BaseController
  include Shared::BookingsController

  around_action :with_user_context

  def index
    render json: Admin::Bookings::Index.new(query: query_params, invoice_id: params[:invoice_id]).execute.result
  end

  def show
    render json: Admin::Bookings::Show.new(booking: booking).execute.result
  end

  def create
    service = Admin::Bookings::Create.new(params: booking_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = Admin::Bookings::Modify.new(booking: booking, params: booking_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def resend_order
    service = Admin::Bookings::ResendOrder.new(booking: booking)

    if service.execute.success?
      render json: service.result
    else
      head :not_found
    end
  end

  def log
    render json: Admin::Bookings::AuditLog.new(booking: booking).execute.result
  end

  def vehicles
    service = ::Bookings::Vehicles.new(company: company, params: vehicles_params, with_manual: true)
    if service.execute.success?
      render json: service.result
    else
      head :not_found
    end
  end

  def timeline
    send_data(
      ::Bookings::ExportTimeline.new(booking: booking).execute.result,
      filename: "Order Service ID #{booking.id}.png",
      type: 'image/png'
    )
  end

  def toggle_critical_flag
    service = Admin::Bookings::ToggleCriticalFlag.new(booking: booking)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def booking_params
    super.merge(params.require(:booking).permit(:booker_id))
  end

  private def query_params
    params.permit(
      :page,
      :per_page,
      :booking_id,
      :order,
      :reverse,
      :search,
      :final,
      :not_final,
      :company_type,
      :with_alerts,
      :from,
      :to,
      :company_id,
      :vendor_name,
      :critical,
      payment_method: [],
      status: [],
      ids: [],
      vehicle_types: [],
      labels: []
    )
  end

  private def new_booking_service
    @new_booking_service ||= Admin::Bookings::Form.new(company: company)
  end

  private def form_details_service
    @form_details_service ||=
      ::Shared::Bookings::FormDetails.new(
        company: company,
        data_params: data_params,
        booking_params: booking_params,
        allow_personal_cards: true,
        with_manual: true,
        include_vehicle_vendor_options: true
      )
  end

  private def repeat_booking_service
    @repeat_booking_service ||= Admin::Bookings::Form.new(booking: booking, repeat: true)
  end

  private def edit_booking_service
    @edit_booking_service ||= Admin::Bookings::Form.new(booking: booking)
  end

  private def cancellation_service
    @cancellation_service ||= Admin::Bookings::Cancel.new(booking: booking, params: cancellation_params)
  end

  private def cancellation_params
    params.permit(:cancellation_fee, :cancel_schedule)
  end

  private def booking
    @booking ||= Booking.with_pk(params[:id])
  end

  private def company
    @company ||= params.key?(:company_id) ? Company.with_pk!(params[:company_id]) : booking&.company
  end

  private def with_user_context
    # Some actions in this controller involve booking-related services
    # from app part, therefore context contains app-specific keys
    context = {
      admin: current_user,
      user: current_user,
      user_gid: current_user.to_gid&.to_s,
      member: (booking.present? && booking.booker.is_a?(Member)) ? booking.booker : nil,
      company: company,
      reincarnated: true,
      original_user: current_user,
      back_office: true
    }

    ApplicationService::Context.with_context(context){ yield }
  end
end
