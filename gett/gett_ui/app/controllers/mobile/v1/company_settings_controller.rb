module Mobile::V1
  class CompanySettingsController < ApplicationController
    def show
      service = ::CompanySettings::Show.new

      render json: service.execute.result
    end
  end
end
