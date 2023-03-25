using Sequel::CoreRefinements

module Admin::Companies
  class Lookup < ApplicationService
    def execute!
      Company
        .dataset
        .association_join(:company_info)
        .left_join(:pricing_rules, company_id: :companies[:id])
        .order(:company_info[:name])
        .select_group(
          :companies[:id].as(:id),
          :companies[:company_type].as(:company_type),
          :company_info[:name].as(:name),
          Sequel.case({ { :companies[:customer_care_password] => nil } => false }, true).as(:customer_care_password_required),
          :companies[:bookings_validation_enabled].as(:bookings_validation_enabled),
          :companies[:active].as(:active)
        )
        .select_append(Sequel.case({ { Sequel.function(:count, :pricing_rules) => 0 } => false }, true).as(:has_pricing_rules_configured))
        .all
        .map(&:values)
    end
  end
end
