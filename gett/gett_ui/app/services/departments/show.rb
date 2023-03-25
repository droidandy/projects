module Departments
  class Show < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :department

    def execute!
      department.as_json(only: [:id, :name], include: [:member_pks])
    end
  end
end
