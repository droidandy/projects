module WorkRoles
  class Form < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    delegate :company, to: :context
    attributes :work_role

    def execute!
      {
        work_role: work_role_data,
        members: policy_scope.as_json(only: [:id, :first_name, :last_name])
      }
    end

    private def work_role_data
      return {} if work_role.blank?

      WorkRoles::Show.new(work_role: work_role).execute.result
    end
  end
end
