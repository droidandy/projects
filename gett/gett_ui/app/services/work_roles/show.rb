module WorkRoles
  class Show < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :work_role

    def execute!
      work_role.as_json(only: [:id, :name], include: [:member_pks])
    end
  end
end
