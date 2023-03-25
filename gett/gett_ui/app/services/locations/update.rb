module Locations
  class Update < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :location, :params
    delegate :errors, to: :location

    def self.policy_class
      Locations::Policy
    end

    def execute!
      transaction do
        result{ update_model(location, location_params) }
        assert{ assign_address(location, address_params) }
      end
    end

    def show_result
      Locations::Show.new(location: location).execute.result
    end

    private def location_params
      params.except(:address, :id)
    end

    private def address_params
      params[:address]
    end
  end
end
