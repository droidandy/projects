module TravelReasons
  class Index < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    def execute!
      policy_scope.all.as_json(only: [:id, :name, :active])
    end
  end
end
