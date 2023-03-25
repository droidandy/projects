module Locations
  class Create < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :location, :params
    delegate :errors, to: :location
    delegate :company, to: :context

    def self.policy_class
      Locations::Policy
    end

    def execute!
      transaction do
        address = Address.lookup_valid!(address_params)
        result { create_model(location, location_params, address_id: address.id) }
      end
    end

    def location
      @location ||= Location.new(company: company)
    end

    def show_result
      Locations::Show.new(location: location).execute.result
    end

    private def address_params
      params[:address]
    end

    private def location_params
      params.except(:address)
    end
  end
end
