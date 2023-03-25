using Sequel::CoreRefinements

class ScheduledReminderCreator < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  FRONT_OFFICE_NOTIFICATED_DAYS_FROM_OVERDUE = [-2, 15, 22].freeze
  BACK_OFFICE_NOTIFICATED_DAYS_FROM_OVERDUE = [1, 15].freeze

  def perform
    notify_front_office
    notify_back_office
  end

  private def notify_front_office
    notify(build_dates(FRONT_OFFICE_NOTIFICATED_DAYS_FROM_OVERDUE), :front)
  end

  private def notify_back_office
    notify(build_dates(BACK_OFFICE_NOTIFICATED_DAYS_FROM_OVERDUE), :back)
  end

  private def notify(dates, office)
    Invoice.not_paid
      .not_under_review
      .where{ |r| r.date(:overdue_at) =~ dates }
      .each { |invoice| Invoices::Remind.new(invoice: invoice, office: office).execute }
  end

  private def build_dates(days_array)
    days_array.map{ |days| Date.current - days }
  end
end
