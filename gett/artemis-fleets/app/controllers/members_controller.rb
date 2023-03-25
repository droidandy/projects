class MembersController < ApplicationController
  def index
    service = Members::Index.new(current_user)
    service.execute!
    render json: service.result
  end

  def create
    service = Members::Create.new(current_user, member_params)
    service.execute!

    if service.success
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = Members::Update.new(current_user, params[:id], member_params)
    service.execute!

    if service.success
      render json: service.result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    service = Members::Destroy.new(current_user, params[:id])
    service.execute!

    if service.success
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def member_params
    params
      .require(:member)
      .permit(
        :first_name, :last_name, :email, :phone, :mobile,
        :role, :active, :avatar
      )
  end
end
