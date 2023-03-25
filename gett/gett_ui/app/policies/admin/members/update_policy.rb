class Admin::Members::UpdatePolicy < Admin::Policy
  delegate :passenger, to: :service
  delegate :add_payment_cards?, :delete_payment_cards?, :change_payroll?, :change_cost_centre?,
    :assign_self?, :accept_pd?, :change_wheelchair?, to: :form_policy

  def permitted_passenger_params
    [
      :first_name, :last_name, :phone, :mobile, :work, :reference, :avatar,
      :onboarding, :notify_with_sms, :notify_with_email, :notify_with_push,
      :wheelchair_user, :active, :email, :work_role_id, :department_id, :booker_pks,
      :passenger_pks, :payroll, :cost_centre, :division, :active, :vip,
      :allow_personal_card_usage, :default_vehicle, :notify_with_calendar_event,
      :allow_preferred_vendor
    ]
  end

  def permitted_custom_attribute_params
    [
      :pd_type,
      :wh_travel,
      :exemption_p11d,
      :exemption_ww_charges,
      :exemption_wh_hw_charges,
      :hw_exemption_time_from,
      :hw_exemption_time_to,
      :wh_exemption_time_from,
      :wh_exemption_time_to,
      :allowed_excess_mileage
    ]
  end

  def permitted_role_id(role_type)
    return if passenger.companyadmin?

    Role[role_type].id if ['passenger', 'admin', 'finance', 'booker', 'travelmanager'].include?(role_type)
  end

  private def form_policy
    policy(:form)
  end
end
