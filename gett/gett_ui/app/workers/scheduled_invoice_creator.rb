using Sequel::CoreRefinements

class ScheduledInvoiceCreator < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform
    companies = Company
      .enterprise
      .select(:companies.*)
      .association_join(:payment_options)
      .where(:payment_options[:invoicing_schedule] => invoicing_schedule)

    companies.map{ |company| Invoices::Create.new(company: company).execute }
  end

  private def invoicing_schedule
    raise "#{self.class} does not implement ##{__method__}"
  end
end
