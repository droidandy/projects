require 'postgis'
using Sequel::CoreRefinements

module PricingRules
  class CalculatePrice < ApplicationService
    attributes :company, :vehicle_type, :pickup, :destination, :distance,
      :has_stops, :asap, :scheduled_at

    RADIUS = 100 # meters

    def execute!
      return if rule.nil?
      return result { to_cents(rule.base_fare) } if rule.price_type.fixed?

      metered_distance = [distance - rule.after_distance, 0].max
      result { to_cents(rule.initial_cost + metered_distance * rule.after_cost) }
    end

    private def to_cents(amount)
      (amount * 100).round
    end

    private def pickup_point
      Postgis.point_to_sql(pickup)
    end

    private def destination_point
      Postgis.point_to_sql(destination)
    end

    private def rule
      return @rule if defined? @rule

      dataset = company.pricing_rules_dataset.active
        .where(Sequel.lit('? = ANY (vehicle_types)', vehicle_type))

      dataset = apply_location_conditions(dataset)
      dataset = apply_time_conditions(dataset)

      dataset =
        if asap?
          dataset.where(booking_type: %w(asap both))
        else
          dataset.where(booking_type: %w(future both))
        end

      dataset = dataset.where(rule_type: 'area') if has_stops?

      @rule = dataset.order(:rule_type).first
    end

    private def apply_location_conditions(dataset)
      dataset.where do |r|
        (
          Sequel.function(:ST_DWithin, r.pickup_point, pickup_point, RADIUS) |
          Sequel.function(
            :ST_Contains,
            Sequel.cast(r.pickup_polygon, :geometry),
            Sequel.cast(pickup_point, :geometry)
          )
        ) & (
          (
            Sequel.function(:ST_DWithin, r.destination_point, destination_point, RADIUS) |
            Sequel.function(
              :ST_Contains,
              Sequel.cast(r.destination_polygon, :geometry),
              Sequel.cast(destination_point, :geometry)
            )
          ) | (
            (r.rule_type =~ 'area') & Sequel.function(
              :ST_Contains,
              Sequel.cast(r.pickup_polygon, :geometry),
              Sequel.cast(destination_point, :geometry)
            )
          )
        )
      end
    end

    def apply_time_conditions(dataset)
      time = scheduled_at.strftime('%H:%M')

      dataset.where do |r|
        (
          (r.time_frame =~ 'daily') & (
            (r.min_time <= time) & (r.max_time >= time)
          )
        ) | (
          (r.time_frame =~ 'custom') & (
            (r.starting_at <= scheduled_at) & (r.ending_at >= scheduled_at)
          )
        )
      end
    end
  end
end
