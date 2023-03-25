module WorkRoles
  class Destroy < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :work_role

    delegate :errors, to: :work_role

    def execute!
      destroy_model(work_role)
    end
  end
end
