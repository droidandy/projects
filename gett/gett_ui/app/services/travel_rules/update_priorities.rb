module TravelRules
  class UpdatePriorities < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :ordered_ids
    delegate :company, to: :context

    def execute!
      company.travel_rules_dataset.update(
        priority: Sequel.case(ordered_ids.map.with_index{ |id, i| [id, i + 1] }, 0, :id)
      )
    end
  end
end
