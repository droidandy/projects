module Departments
  class Index < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    def execute!
      policy_scope.all.as_json(only: [:id, :name])
    end
  end
end
