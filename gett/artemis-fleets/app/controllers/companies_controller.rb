class CompaniesController < ApplicationController
  def show
    service = Companies::Dashboard.new(current_user)
    service.execute!

    render json: service.result
  end

  def update
    service = Companies::Update.new(current_user, company_params)
    service.execute!

    if service.success
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def company_params
    params.require(:company).permit(:logo)
  end
end
