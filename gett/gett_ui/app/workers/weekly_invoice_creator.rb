class WeeklyInvoiceCreator < ScheduledInvoiceCreator
  private def invoicing_schedule
    'weekly'
  end
end
