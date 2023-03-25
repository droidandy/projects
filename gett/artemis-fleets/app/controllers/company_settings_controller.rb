class CompanySettingsController < ApplicationController
  def show
    service = CompanySettings::Show.new(current_user)
    service.execute!
    render json: service.result
  end

  def update
    service = CompanySettings::Update.new(current_user, settings_params)
    service.execute!
    if service.success
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def settings_params
    params
      .require(:company)
      .permit(
        primary_contact: [
          :phone, :mobile, :fax, :email, :first_name, :last_name,
          address: [:line, :lat, :lng, :postal_code]
        ],
        billing_contact: [
          :phone, :mobile, :fax, :email, :first_name, :last_name,
          address: [:line, :lat, :lng, :postal_code]
        ]
      )
  end
end
