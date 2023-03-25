module Admin::PricingRules
  class Copy < ApplicationService
    include ApplicationService::ModelMethods

    attributes :target_id, :source_id

    def execute!
      return if target_id.blank? || source_id.blank?

      transaction do
        result do
          source_pricing_rules.each do |rule|
            PricingRule.create(rule.values.except(:id).merge!(
              company_id: target_id,
              pickup_point: Postgis.geo_to_point(rule.values[:pickup_point]),
              destination_point: Postgis.geo_to_point(rule.values[:destination_point]),
              pickup_polygon: Postgis.sql_to_polygon(rule.values[:pickup_polygon]),
              destination_polygon: Postgis.sql_to_polygon(rule.values[:destination_polygon])
            ))
          end
        end
      end
    end

    private def source_pricing_rules
      PricingRule
        .dataset
        .where(company_id: source_id)
        .select_append(
          Sequel.function(:ST_AsGeoJSON, :pickup_point).as(:pickup_point),
          Sequel.function(:ST_AsGeoJSON, :destination_point).as(:destination_point),
          Sequel.function(:ST_AsText, :pickup_polygon).as(:pickup_polygon),
          Sequel.function(:ST_AsText, :destination_polygon).as(:destination_polygon)
        )
        .all
    end
  end
end
