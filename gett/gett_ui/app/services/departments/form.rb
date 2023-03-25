module Departments
  class Form < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    delegate :company, to: :context
    attributes :department

    def execute!
      {
        department: department_data,
        members: policy_scope.as_json(only: [:id, :first_name, :last_name])
      }
    end

    private def department_data
      return {} if department.blank?

      Departments::Show.new(department: department).execute.result
    end
  end
end
