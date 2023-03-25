class Passengers::FormPolicy < ServicePolicy
  allow_all!

  scope :bookers do |member|
    Bookers::IndexPolicy.scope(:passenger_form)[member].active
  end

  delegate :passenger, to: :service
  delegate :company, to: :member

  def assign_bookers?
    member.executive? || (company.bbc? && member_is_a_passenger?)
  end

  def assign_self?
    return member.booker? if passenger.blank?

    booker_can_see_passenger?
  end

  def change_role?
    member.executive? && !passenger&.companyadmin?
  end

  def change_active?
    if passenger.present?
      member.executive? || member.passenger_pks.include?(passenger.id)
    else
      !member.passenger?
    end
  end

  def see_log?
    return false if company.bbc?

    member.executive?
  end

  def change_email?
    return true if company.bbc? && member_is_a_passenger?

    passenger.present? ? member.executive? : !member.passenger?
  end
  alias change_department? change_email?
  alias change_work_role?  change_email?
  alias change_payroll? change_email?
  alias change_cost_centre? change_email?
  alias change_division? change_email?

  def add_payment_cards?
    policy(PaymentCards::Policy).execute?
  end
  alias delete_payment_cards? add_payment_cards?

  def change_personal_card_usage?
    policy(:update).change_personal_card_usage?
  end

  def change_wheelchair?
    !company.bbc? || member.executive?
  end

  private def booker_can_see_passenger?
    member.booker? &&
      (passenger.booker_pks.empty? || passenger.booker_pks.include?(member.id))
  end

  private def member_is_a_passenger?
    member.pk == passenger&.pk
  end

  # bbc related abilities
  def edit_bbc_attrs?
    return false unless company.bbc?

    member.executive?
  end

  def accept_pd?
    return false if !company.bbc? || passenger.blank?

    member_is_a_passenger?
  end

  def change_pd?
    return false unless company.bbc?

    member.executive?
  end
end
