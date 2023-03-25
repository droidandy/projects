module Departments
  class Destroy < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :department

    delegate :errors, to: :department

    def execute!
      destroy_model(department)
    end
  end
end
