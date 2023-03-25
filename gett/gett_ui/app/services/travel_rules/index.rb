module TravelRules
  class Index < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    delegate :company, to: :context

    def execute!
      company.travel_rules_dataset
        .order(:priority)
        .eager(:members, :departments, :work_roles, :vehicles)
        .all
        .map do |rule|

        rule.as_json(exclude: [:min_time, :max_time]).tap do |j|
          j[:min_time]           = rule.min_time.to_s
          j[:max_time]           = rule.max_time.to_s
          j[:member_pks]         = rule.members.map(&:id)
          j[:department_pks]     = rule.departments.map(&:id)
          j[:work_role_pks]      = rule.work_roles.map(&:id)
          j[:vehicle_pks]        = rule.vehicles.sort_by(&:id).uniq(&:name).map{ |v| v.id.to_s }
          j[:cheapest]           = rule.cheapest?
          j[:allow_unregistered] = rule.allow_unregistered
        end
      end
    end
  end
end
