class Passengers::UpdatePolicy < ServicePolicy
  delegate :company, to: :member
  delegate :passenger, to: :service
  delegate :add_payment_cards?, :delete_payment_cards?, :change_payroll?,
    :change_cost_centre?, :accept_pd?,
    to: :form_policy

  def execute?
    member.back_office? ||
      member.executive? ||
      member.id == passenger.id ||
      (member.booker? &&
        (member.passenger_pks.include?(passenger.id) ||
          passenger.bookers_dataset.empty?
        )
      )
  end

  def assign_self?
    member.booker? && (passenger.booker_pks.empty? || passenger.booker_pks.include?(member.id))
  end

  def change_personal_card_usage?
    return false if passenger.blank?
    return false if company.bbc?

    passenger.id == member.id
  end

  def permitted_passenger_params
    permitted_params = [
      :first_name, :last_name, :phone, :mobile, :work, :reference, :avatar, :onboarding,
      :notify_with_sms, :notify_with_email, :notify_with_push, :notify_with_calendar_event, :wheelchair_user, :vip,
      :default_vehicle, :default_phone_type
    ]

    if member.executive? || (company.bbc? && member_is_a_passenger?)
      permitted_params += [
        :email,
        :work_role_id,
        :department_id,
        :payroll,
        :cost_centre,
        :division,
        :booker_pks
      ]
    end

    permitted_params << :passenger_pks if member.executive?
    permitted_params << :active if member.booker? || member.executive?
    permitted_params << :allow_preferred_vendor if member.admin?
    permitted_params << :allow_personal_card_usage if change_personal_card_usage?

    permitted_params
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
    ].tap do |permitted_params|
      permitted_params << :pd_accepted if accept_pd?
    end
  end

  def permitted_role_id(role_type)
    return if passenger.companyadmin?

    permitted_roles = ['passenger']
    permitted_roles << 'booker' if member.booker? || member.executive?
    permitted_roles += ['admin', 'finance', 'travelmanager'] if member.executive?

    Role[role_type].id if permitted_roles.include?(role_type)
  end

  private def form_policy
    policy(:form)
  end

  private def member_is_a_passenger?
    member.pk == passenger&.pk
  end
end
