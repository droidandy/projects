class Sessions::CurrentPolicy < ServicePolicy
  delegate :company, to: :member

  allow_all!

  def see_bookers?
    company.bbc? || !member.passenger?
  end

  def create_passengers?
    !member.passenger?
  end

  def administrate_company?
    member.executive?
  end

  def manage_travel_policies?
    administrate_company? && !company.bbc?
  end

  def manage_travel_reasons?
    administrate_company? && !company.bbc?
  end

  def manage_finance?
    member.executive? || member.finance?
  end
  alias manage_report_settings? manage_finance?

  def see_statistics?
    Charts::IndexPolicy.new(user, service).execute?
  end

  def export_bookings?
    return member.executive? if company.bbc?

    true
  end

  def export_receipts?
    !company.bbc?
  end
end
