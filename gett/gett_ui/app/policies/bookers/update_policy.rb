class Bookers::UpdatePolicy < ServicePolicy
  scope(:passengers, &Bookers::FormPolicy.scope(:passengers))

  def execute?
    member.executive? || member.id == service.booker.id
  end

  def update_role?
    member.executive?
  end

  def permitted_booker_params
    permitted_params = [:first_name, :last_name, :phone, :mobile, :avatar, :onboarding, :notify_with_sms, :notify_with_email, :notify_with_push, :assigned_to_all_passengers]

    if member.executive?
      permitted_params += [:email, :work_role_id, :department_id]
      permitted_params << :active if member.id != service.booker.id
    end

    permitted_params
  end

  def permitted_passenger_pks(pks)
    available_passengers = scope(:passengers).select(Sequel[:users][:id]).pluck(:id)
    available_passengers & (pks || []).map(&:to_i)
  end
end
