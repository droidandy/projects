class BookersController < ApplicationController
  def index
    render json: Bookers::Index.new(query: query_params).execute.result
  end

  def show
    service = Bookers::Show.new(booker: booker)

    render json: service.execute.result
  end

  def log
    render json: Bookers::AuditLog.new(booker: booker).execute.result
  end

  def new
    render json: Bookers::Form.new.execute.result
  end

  def create
    service = Bookers::Create.new(params: booker_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def edit
    render json: Bookers::Form.new(booker: booker).execute.result
  end

  def update
    service = Bookers::Update.new(booker: booker, params: booker_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    service = Bookers::Destroy.new(booker: booker)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def export
    send_data(
      Bookers::Export.new(query: query_params).execute.result,
      filename: 'bookers.csv',
      type: 'text/csv'
    )
  end

  def toggle_passenger
    service = Bookers::TogglePassenger.new(booker: booker, passenger: current_member)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def booker
    @booker ||= current_company.bookers_dataset.with_pk!(params[:id])
  end

  private def query_params
    params.permit(:page, :order, :reverse, :search, role: [])
  end

  private def booker_params
    params.require(:booker).permit(self.class.permited_booker_params)
  end

  def self.permited_booker_params
    [ :first_name, :last_name, :email, :phone, :mobile,
      :role_type, :active, :avatar, :work_role_id,
      :department_id, :onboarding, :notify_with_sms,
      :notify_with_email, :notify_with_push, :assigned_to_all_passengers, passenger_pks: [] ]
  end
end
