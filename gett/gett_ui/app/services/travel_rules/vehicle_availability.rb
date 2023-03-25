module TravelRules
  class VehicleAvailability < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :vehicles, :params, :with_manual
    delegate :company, to: :context

    def execute!
      mark_available!
      disallow_by_wheelchair! if passenger&.wheelchair_user?
      disallow_by_order_type!
      disallow_by_country!
      disallow_by_stop_points!
      disallow_by_scheduled_type!
      disallow_by_policy!
      disallow_by_rule! unless ignore_rules?
      disallow_by_payment_type!
      disallow_by_scheduled_at!
      disallow_by_booker_role!

      yield allowed_services if block_given?

      reject_manual!
      reject_by_availability_fallbacks!
      disallow_by_availability!
      disallow_by_cheapest! unless ignore_rules?
      sort_by_availability_and_price!
      uniq_by_name!
      success!
    end

    private def mark_available!
      vehicles.each(&:available!)
    end

    private def ignore_rules?
      return @ignore_rules if defined? @ignore_rules

      @ignore_rules = payment_personal_card? || payment_cash?
    end

    private def payment_personal_card?
      params[:payment_method] == PaymentOptions::PaymentType::PERSONAL_PAYMENT_CARD &&
        passenger.payment_cards_dataset[params[:payment_card_id].to_i]&.personal?
    end

    private def payment_cash?
      params[:payment_method] == PaymentOptions::PaymentType::CASH
    end

    private def disallow_by_wheelchair!
      disallow_if!(reason: :wheelchair) do |vehicle|
        ::Bookings::WHEELCHAIR_VEHICLES.exclude?(vehicle.name)
      end
    end

    private def disallow_by_order_type!
      return if params[:as_directed].blank?

      disallow_if!(reason: :type) do |vehicle|
        !Bookings::Providers::AS_DIRECTED.include?(vehicle.service_type.to_sym)
      end
    end

    private def disallow_by_country!
      disallow_if!(reason: :area) do |vehicle|
        !location_based_services.include?(vehicle.service_type.to_sym)
      end
    end

    private def disallow_by_stop_points!
      disallow_if!(reason: :rule) do |vehicle|
        params[:stops].present? && via_provider?(vehicle)
      end
    end

    private def disallow_by_scheduled_type!
      disallow_if!(reason: :rule) do |vehicle|
        if params[:scheduled_type] == 'now'
          Bookings::LATER_ONLY_VEHICLES.include?(vehicle.name) ||
            Bookings::LATER_ONLY_PROVIDERS.include?(vehicle.service_type)
        else
          Bookings::ASAP_ONLY_VEHICLES.include?(vehicle.name) ||
            via_provider?(vehicle)
        end
      end
    end

    private def disallow_by_policy!
      disallow_if!(reason: :rule) do |vehicle|
        with_manual && vehicle.manual? && !policy.allow_manual?
      end
    end

    private def disallow_by_rule!
      return if applied_rule.blank?

      disallow_if!(reason: :rule) do |vehicle|
        # manual vehicles should ignore travel rules
        !vehicle.manual? &&
          (applied_rule.vehicles.map(&:id) & vehicle.vehicle_ids).blank?
      end
    end

    private def disallow_by_payment_type!
      disallow_if!(reason: :unregistered_user) do
        company.with_periodic_payment_type? && passenger.blank?
      end

      disallow_if!(reason: :rule) do |vehicle|
        payment_cash? && !Bookings::CASH_VEHICLES.include?(vehicle.name)
      end
    end

    private def disallow_by_availability!
      # all vehicles that do not have `:value` after processing were not
      # returned by corresponding API service
      disallow_if!(reason: :area){ |vehicle| vehicle.value.nil? }
    end

    private def disallow_by_cheapest!
      return unless applied_rule&.cheapest?

      prices = vehicles.select(&:available).map{ |v| v[:price].to_i }

      return if prices.empty?

      min_price = prices.min

      disallow_if!(reason: :rule) do |vehicle|
        vehicle[:price].to_i > min_price
      end
    end

    private def reject_by_availability_fallbacks!
      vehicles.reject! do |v|
        (v.primary? && v.value.nil? && v.fallback.value.present?) ||
          (v.fallback? && (v.primary.value.present? || v.value.nil?))
      end
    end

    private def reject_manual!
      vehicles.reject! do |vehicle|
        vehicle.manual? && (
          !with_manual || !params[:payment_method].in?(PaymentOptions::PaymentType::INVOICE_TYPES)
        )
      end
    end

    private def disallow_by_scheduled_at!
      # carey has specific business logic: we should disallow this vehicle
      # if scheduled_at isn't later than 2 hours
      return if params[:scheduled_at].blank?

      scheduled_at = Time.parse(params[:scheduled_at]).utc.beginning_of_minute
      expected_scheduled_at = 2.hours.from_now.beginning_of_minute
      return if scheduled_at >= expected_scheduled_at

      vehicles.select(&:carey?).first.disallow_with!(:early_scheduled)
    end

    private def disallow_by_booker_role!
      return if context.admin&.superadmin?

      disallow_if!(reason: :only_for_superadmin) do |vehicle|
        vehicle.name == 'Special'
      end
    end

    private def disallow_if!(reason:)
      vehicles.each do |vehicle|
        next if vehicle.unavailable_reason.present?

        vehicle.disallow_with!(reason) if yield vehicle
      end
    end

    private def via_provider?(vehicle)
      vehicle.name == 'Standard' && vehicle.gett? && domestic?
    end

    private def domestic?
      ::Bookings.domestic?(params.dig(:pickup_address, :country_code))
    end

    private def sort_by_availability_and_price!
      vehicles.sort_by! do |vehicle|
        if vehicle.available?
          [0, (vehicle.price || Float::INFINITY), 0]
        else
          # among unavailable vehicles, if possible, must be selected OT for proper displaying of 'pre-book only' link
          [1, Float::INFINITY, (vehicle.ot? ? 0 : 1)]
        end
      end
    end

    private def uniq_by_name!
      vehicles.uniq!(&:name)
    end

    private def location_based_services
      @location_based_services ||= LocationServicesSelector.new(location: params[:pickup_address]).execute.result
    end

    private def allowed_services
      vehicles.select(&:available).map(&:service_type).uniq.map(&:to_sym)
    end

    private def applied_rule
      return @applied_rule if defined? @applied_rule

      @applied_rule = travel_rules.presence &&
        travel_rules.find{ |rule| RuleChecker.new(rule: rule, params: params).execute.success? }
    end

    private def passenger
      return @passenger if defined? @passenger

      @passenger = company.passengers_dataset[params[:passenger_id].to_i]
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
  end
end
