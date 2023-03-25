class Admin::SessionsController < Admin::BaseController
  def show
    render json: Admin::Sessions::Show.new.execute.result
  end

  def reincarnate
    service = Admin::Sessions::Reincarnate.new(company_id: params[:company_id], password: params[:password])

    if service.execute.success?
      render json: service.result
    else
      render json: {error: service.errors}, status: :unauthorized
    end
  end

  # abandon incarnation and ascend to admin-only scope
  def ascend
    render json: Admin::Sessions::Ascend.new.execute.result
  end
end
