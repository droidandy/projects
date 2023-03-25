module TravelRules
  class Form < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    delegate :company, to: :context

    def execute!
      {
        members: company.passengers_dataset.by_name.as_json(only: [:id, :first_name, :last_name]),
        work_roles: company.work_roles.as_json(only: [:id, :name]),
        departments: company.departments.as_json(only: [:id, :name]),
        vehicles: vehicles
      }
    end

    private def vehicles
      vehicles =
        Vehicle.active.all.reject do |vehicle|
          vehicle.fallback? || vehicle.manual?
        end

      vehicles.sort_by(&:id).uniq(&:name).as_json(only: [:id, :name])
    end
  end
end
