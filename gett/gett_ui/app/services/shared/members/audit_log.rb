class Shared::Members::AuditLog < ApplicationService
  include ApplicationService::ChangesFetcher

  TRANSFORM_MAPPING = {
    'onboarding' => { false => 'Onboarded', true => 'Waiting for onboarding', nil => 'Off' }
  }.freeze

  def execute!
    changes_from(member.versions)
  end

  def member
    fail("#{self.class.name} has to define #{__method__} method")
  end

  private def transform_value(key, value)
    return TRANSFORM_MAPPING[key][value] if TRANSFORM_MAPPING.key?(key)

    super
  end
end
