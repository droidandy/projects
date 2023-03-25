class CompanySettingsController < ApplicationController
  def show
    service = CompanySettings::Show.new

    render json: service.execute.result
  end

  def update
    CompanySettings::Update.new(params: settings_params).execute

    render json: Companies::Dashboard.new.execute.result
  end

  private def settings_params
    params
      .require(:company)
      .permit(
        address: [:line, :lat, :lng, :postal_code, :country_code, :city, :region],
        primary_contact: [
          :phone, :mobile, :fax, :email, :first_name, :last_name
        ],
        billing_contact: [
          :phone, :mobile, :fax, :email, :first_name, :last_name,
          address: [:line, :lat, :lng, :postal_code, :country_code, :city, :region]
        ]
      )
  end
end
