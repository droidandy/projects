class PassengersController < ApplicationController
  include HomePrivacy::ControllerHelpers

  around_action :skip_address_sanitize_for_self,
    only: [:log, :stats, :show, :edit, :update]
  around_action :skip_address_sanitize, only: :calculate_excess

  def index
    render json: Passengers::Index.new(query: query_params).execute.result
  end

  def log
    render json: Passengers::AuditLog.new(passenger: passenger).execute.result
  end

  def stats
    service = Passengers::Stats.new(passenger: passenger)

    render json: service.execute.result
  end

  def new
    render json: Passengers::Form.new.execute.result
  end

  def create
    service = Passengers::Create.new(params: passenger_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def show
    render json: Passengers::Show.new(passenger: passenger).execute.result
  end

  def edit
    render json: Passengers::Form.new(passenger: passenger).execute.result
  end

  def update
    service = Passengers::Update.new(passenger: passenger, params: passenger_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def export
    send_data(
      Passengers::Export.new(query: query_params).execute.result,
      filename: 'passengers.csv',
      type: 'text/csv'
    )
  end

  def import
    Passengers::ManualImport.new(params: import_params).execute
    head :ok
  end

  def calculate_excess
    service = Passengers::CalculateExcess.new(
      home_address: calculate_excess_params[:home_address].to_h,
      work_address: calculate_excess_params[:work_address].to_h
    )

    render json: service.execute.result
  end

  def toggle_booker
    service = Passengers::ToggleBooker.new(passenger: passenger, booker: current_member)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def passenger
    @passenger ||= current_company.passengers_dataset.with_pk!(params[:id])
  end

  private def query_params
    params.permit(:page, :order, :reverse, :search)
  end

  private def passenger_params
    params.require(:passenger).permit(self.class.permited_passenger_params).tap do |params|
      restore_address_params!(params[:home_address])
    end
  end

  private def import_params
    params.require(:import).permit(:file, :onboarding)
  end

  private def calculate_excess_params
    params.permit(
      work_address: [:line, :lat, :lng, :postal_code, :country_code, :city, :region],
      home_address: [:line, :lat, :lng, :postal_code, :country_code, :city, :region]
    )
  end

  private def skip_address_sanitize_for_self
    HomePrivacy.with_sanitize(current_member.pk != passenger.pk) do
      yield
    end
  end

  def self.permited_passenger_params
    [
      :first_name, :last_name, :email, :phone, :mobile, :work,
      :reference, :department, :active, :avatar, :onboarding,
      :work_role_id, :department_id, :self_assigned, :role_type,
      :notify_with_sms, :notify_with_email, :notify_with_push, :wheelchair_user,
      :payroll, :cost_centre, :division, :notify_with_calendar_event,
      :vip, :allow_personal_card_usage, :default_vehicle,
      booker_pks: [],
      passenger_pks: [],
      work_address: [
        :line, :lat, :lng, :postal_code, :country_code, :city, :region
      ],
      home_address: [
        :id, :line, :lat, :lng, :postal_code, :country_code, :city, :region
      ],
      custom_attributes: [
        :pd_type, :pd_accepted, :wh_travel,
        :exemption_p11d, :exemption_ww_charges, :exemption_wh_hw_charges,
        :hw_exemption_time_from, :hw_exemption_time_to,
        :wh_exemption_time_from, :wh_exemption_time_to,
        :allowed_excess_mileage
      ]
    ]
  end
end
