using Sequel::CoreRefinements

module Invoices
  class Index < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    delegate :company, to: :context

    def execute!
      {
        items: invoice_items,
        outstanding_balance: company.outstanding_balance,
        transaction_history: transaction_history,
        company_payment_types: company.payment_types
      }
    end

    private def invoice_items
      company.invoices_dataset.order(:created_at).reverse.all.map do |invoice|
        Invoices::Show.new(invoice: invoice).execute.result
      end
    end

    private def transaction_history
      company.invoices_dataset.paid
        .group{ date_trunc('month', created_at) }
        .select{ [date_trunc('month', created_at).as(:day), sum(:amount_cents).as(:total)] }
        .from_self
        .order(:day.desc)
        .limit(12)
        .all
        .reverse
        .map do |inv|
          {
            name: inv[:day].strftime('%b'),
            value: inv[:total].to_f / 100
          }
        end
    end
  end
end
