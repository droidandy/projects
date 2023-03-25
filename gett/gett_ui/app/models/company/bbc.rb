module Company::BBC
  extend ActiveSupport::Concern

  CUSTOM_NUMERICALL_ATTRIBUTE_MAX_VALUE = 10000

  included do
    plugin :custom_attributes,
      attributes: [
        travel_policy_mileage_limit: :to_i.to_proc,
        hw_deviation_distance: :to_i.to_proc,
        excess_cost_per_mile: :to_f.to_proc,
        p11d: :to_i.to_proc
      ]
  end

  def validate
    super
    return unless bbc?

    if hr_feed_enabled.present?
      errors.add(:hr_feed_enabled, 'HR Feed not allowed for BBC')
    end

    [:travel_policy_mileage_limit, :excess_cost_per_mile, :p11d].each do |attr|
      next if public_send(attr).present?

      errors.add("custom_attributes.#{attr}", "#{attr} cannot be empty")
    end

    [:travel_policy_mileage_limit, :hw_deviation_distance, :excess_cost_per_mile].each do |attr|
      value = public_send(attr)

      if value.present? && (value < 0 || value > CUSTOM_NUMERICALL_ATTRIBUTE_MAX_VALUE)
        errors.add("custom_attributes.#{attr}", "#{attr} is invalid")
      end
    end

    if p11d.present? && (p11d < 0 || p11d > 100)
      errors.add('custom_attributes.p11d', 'P11d is invalid')
    end
  end
end
