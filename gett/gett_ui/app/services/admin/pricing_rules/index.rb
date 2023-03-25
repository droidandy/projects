module Admin::PricingRules
  class Index < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    def self.policy_class
      Admin::Policy
    end

    attributes :company_id

    def execute!
      address_fields = %i(
        lat lng postal_code country_code line timezone city region
      )
      pricing_rules_dataset.all.map do |rule|
        rule.as_json(
          only: %i(
            id name active rule_type price_type booking_type min_time max_time
            time_frame starting_at ending_at
            base_fare initial_cost after_distance after_cost vehicle_types
            pickup_polygon destination_polygon
          ),
          include: {
            pickup_address: { only: address_fields },
            destination_address: { only: address_fields }
          }
        ).merge(
          min_time: rule.min_time.to_s,
          max_time: rule.max_time.to_s
        )
      end
    end

    private def pricing_rules_dataset
      @pricing_rules_dataset ||= PricingRule
        .where(company_id: company_id)
        .order(:created_at).reverse
        .eager(:pickup_address, :destination_address)
        .select_append(
          Sequel.function(:ST_AsText, :pickup_polygon).as(:pickup_polygon_text),
          Sequel.function(:ST_AsText, :destination_polygon).as(:destination_polygon_text)
        )
    end
  end
end
