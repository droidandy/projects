class TravelRules::AuditLog < ApplicationService
  include ApplicationService::ChangesFetcher
  attributes :travel_rule

  def execute!
    sort_changes(changes(travel_rule.versions))
  end
end
