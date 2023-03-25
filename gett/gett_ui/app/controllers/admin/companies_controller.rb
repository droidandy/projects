class Admin::CompaniesController < Admin::BaseController
  def index
    render json: Admin::Companies::Index.new(query: query_params).execute.result
  end

  def lookup
    render json: Admin::Companies::Lookup.new.execute.result
  end

  def new
    service = Admin::Companies::Form.new

    render json: service.execute.result
  end

  def edit
    service = Admin::Companies::Form.new(company: company)

    render json: service.execute.result
  end

  def log
    render json: Admin::Companies::AuditLog.new(company: company).execute.result
  end

  def create
    service = Admin::Companies::Create.new(params: company_params)

    if service.execute.success?
      render json: service.result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = Admin::Companies::Update.new(company: company, params: company_params)

    if service.execute.success?
      render json: service.result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def toggle_status
    Admin::Companies::ToggleStatus.new(company: company).execute

    head :ok
  end

  def destroy
    service = Admin::Companies::Destroy.new(company: company)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def verify_gett
    service = Gett::Products.new(verify_business_id: params[:gett_business_id], address: address_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def verify_ot
    service = OneTransport::ProfileLookup.new(
      ot_username: params[:ot_username],
      ot_client_number: params[:ot_client_number]
    )

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def stats
    service = Admin::Statistics::Company.new(company: company)

    render json: service.execute.result
  end

  def disable
    if Admin::Companies::Disable.new(company: company).execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  private def company
    @company ||= Company.with_pk!(params[:id])
  end

  private def query_params
    params.permit(:page, :order, :reverse, :search, ddi_type: [], credit_rate_status: [], country_code: [])
  end

  private def company_params
    params.require(:company)
      .permit(
        :name,
        :sap_id,
        :company_type,
        :vat_number,
        :account_number,
        :sort_code,
        :default_driver_message,
        :cost_centre,
        :legal_name,
        :destination_required,
        :booking_reference_required,
        :salesman_id,
        :account_manager_id,
        :booking_fee,
        :run_in_fee,
        :handling_fee,
        :logo,
        :gett_business_id,
        :ot_username,
        :ot_client_number,
        :phone_booking_fee,
        :tips,
        :multiple_booking,
        :booker_notifications,
        :booker_notifications_emails,
        :payroll_required,
        :cost_centre_required,
        :customer_care_password,
        :cancellation_before_arrival_fee,
        :cancellation_after_arrival_fee,
        :gett_cancellation_before_arrival_fee,
        :gett_cancellation_after_arrival_fee,
        :get_e_cancellation_before_arrival_fee,
        :get_e_cancellation_after_arrival_fee,
        :splyt_cancellation_before_arrival_fee,
        :splyt_cancellation_after_arrival_fee,
        :carey_cancellation_before_arrival_fee,
        :carey_cancellation_after_arrival_fee,
        :international_booking_fee,
        :system_fx_rate_increase_percentage,
        :hr_feed_enabled,
        :allow_preferred_vendor,
        :marketing_allowed,
        :bookings_validation_enabled,
        :api_enabled,
        :credit_rate_registration_number,
        :quote_price_increase_percentage,
        :quote_price_increase_pounds,
        :critical_flag_due_on,
        :country_code,
        :api_notifications_enabled,
        linked_company_pks: [],
        ddi: [:type, :phone],
        address: [
          :line,
          :lat,
          :lng,
          :postal_code,
          :country_code,
          :city,
          :region
        ],
        legal_address: [
          :line,
          :lat,
          :lng,
          :postal_code,
          :country_code,
          :city,
          :region
        ],
        payment_options: [
          :business_credit,
          :payment_terms,
          :invoicing_schedule,
          :split_invoice,
          :additional_billing_recipients,
          :default_payment_type,
          payment_types: []
        ],
        admin: [
          :onboarding,
          :first_name,
          :last_name,
          :phone,
          :email,
          :password
        ],
        custom_attributes: [
          :travel_policy_mileage_limit,
          :hw_deviation_distance,
          :p11d,
          :excess_cost_per_mile
        ]
      )
  end

  private def address_params
    params.permit(:latitude, :longitude)
  end
end
