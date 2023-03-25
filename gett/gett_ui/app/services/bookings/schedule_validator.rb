module Bookings
  class ScheduleValidator < ApplicationService
    include ApplicationService::Context

    attributes :company, :scheduled_ats, :vehicle_value, :passenger_id, :pickup_address, :destination_address

    WEEKEND_DAYS = [0, 6].freeze

    def execute!
      {
        available_scheduled_ats: available_scheduled_ats,
        unavailable_scheduled_ats: unavailable_scheduled_ats
      }
    end

    def available_scheduled_ats
      return scheduled_ats if vehicle_value.blank?

      @available_scheduled_ats ||=
        scheduled_ats.select do |scheduled_at|
          declined = nil

          travel_rules.each do |rule|
            next unless declined.nil? && rule_fits?(rule, scheduled_at)

            declined = !rule.vehicles.map(&:value).include?(vehicle_value)
          end

          !declined
        end
    end

    def unavailable_scheduled_ats
      scheduled_ats - available_scheduled_ats
    end

    private def travel_rules
      @travel_rules ||=
        travel_rules_dataset.all.select do |rule|
          if passenger.present?
            rule.members.include?(passenger) ||
              passenger.department.in?(rule.departments) ||
              passenger.work_role.in?(rule.work_roles)
          else
            rule.allow_unregistered?
          end
        end
    end

    private def travel_rules_dataset
      company.travel_rules_dataset
        .active
        .order_by(:priority)
        .eager(:members, :departments, :work_roles)
    end

    private def rule_fits?(rule, scheduled_at)
      rule_checker =
        TravelRules::VehicleAvailability::RuleChecker.new(
          rule: rule,
          params: {
            pickup_address: pickup_address,
            destination_address: destination_address,
            scheduled_at: scheduled_at
          }
        )

      member_included =
        rule.members.include?(passenger) ||
        passenger.department.in?(rule.departments) ||
        passenger.work_role.in?(rule.work_roles)

      member_included && rule_checker.execute.result
    end

    private def company
      attributes[:company] || context.company
    end

    private def passenger
      return @passenger if defined?(@passenger)

      @passenger = company.passengers_dataset[passenger_id.to_i]
    end
  end
end
