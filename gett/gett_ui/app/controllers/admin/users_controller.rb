class Admin::UsersController < Admin::BaseController
  def index
    render json: Admin::Users::Index.new(query: query_params).execute.result
  end

  def new
    render json: Admin::Users::Form.new.execute.result
  end

  def create
    service = Admin::Users::Create.new(params: user_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def edit
    render json: Admin::Users::Form.new(user: user).execute.result
  end

  def update
    service = Admin::Users::Update.new(user: user, params: user_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def verify_email
    service = Admin::Users::VerifyEmail.new(email: params[:email], id: params[:id])

    render json: service.execute.result
  end

  private def user
    @user ||= User[params[:id]]
  end

  private def query_params
    params.permit(:page, :order, :reverse, :search)
  end

  private def user_params
    params.require(:user).permit(
      :first_name, :last_name, :email, :avatar, :password, :password_confirmation,
      :user_role_name, :company_id, :member_role_type, :phone, :payroll, :cost_centre,
      :master_token_enabled
    )
  end
end
