class Admin::MembersController < Admin::BaseController
  def index
    render json: Admin::Members::Index.new(query: query_params).execute.result
  end

  def stats
    service = Admin::Members::Stats.new(member: member)

    render json: service.execute.result
  end

  def edit
    render json: Admin::Members::Form.new(member: member).execute.result
  end

  def update
    service = Admin::Members::Update.new(member: member, params: member_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def reinvite
    service = ::Members::Reinvite.new(member: member)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def update_password
    service = ::Users::UpdatePassword.new(params: password_params).with_context(user: member, reincarnated: true)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def log
    render json: Admin::Members::AuditLog.new(member: member).execute.result
  end

  def activate_all
    Admin::Members::ActivateAll.new(company: company).execute

    head :ok
  end

  def toggle_notifications
    service = Admin::Members::ToggleNotifications.new(
      company: company,
      params: toggle_notifications_params
    )

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  private def company
    @company ||= Company.with_pk!(params[:company_id])
  end

  private def member
    @member ||= Member.with_pk!(params[:id])
  end

  private def member_params
    params.require(:user).permit(PassengersController.permited_passenger_params + [
      :allow_preferred_vendor,
      passenger_pks: []
    ])
  end

  private def query_params
    params.permit(:page, :order, :reverse, :search, company_type: [], member_role_name: [])
  end

  private def password_params
    params.require(:user).permit(:password, :password_confirmation)
  end

  private def toggle_notifications_params
    params.permit(*Admin::Members::ToggleNotifications::ALLOWED_FIELDS)
  end
end
