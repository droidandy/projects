class MonthlyInvoiceCreator < ScheduledInvoiceCreator
  private def invoicing_schedule
    'monthly'
  end

  def perform
    # Only perform on the first Thursday of month
    return if Time.current.day > Date::DAYNAMES.length

    super
  end
end
