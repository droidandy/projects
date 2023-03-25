class Admin::Alerts::Destroy < ApplicationService
  include ApplicationService::ModelMethods

  RESOLVABLE_ALERT_TYPES = %w'has_no_driver driver_is_late'.freeze
  private_constant :RESOLVABLE_ALERT_TYPES

  attributes :alert_id

  def execute!
    if RESOLVABLE_ALERT_TYPES.include?(alert.type)
      update_model(alert, resolved: true)
    else
      destroy_model(alert)
    end
  end

  private def alert
    @alert ||= Alert.with_pk(alert_id)
  end
end
