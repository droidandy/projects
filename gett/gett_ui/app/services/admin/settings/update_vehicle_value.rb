module Admin::Settings
  class UpdateVehicleValue < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    PERMITTED_FIELDS = ['earliest_available_in', 'pre_eta'].freeze

    attributes :vehicle_name, :field, :value

    def execute!
      fail ArgumentError, "unable to update #{field}" unless PERMITTED_FIELDS.include?(field)

      Vehicle.where(name: vehicle_name).update(field => value)
    end

    def self.policy_class
      Admin::Settings::Policy
    end
  end
end
