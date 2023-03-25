using Sequel::CoreRefinements

module Shared::Invoices
  class ExportCSV < Shared::Invoices::Export
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :periods

    private def invoice_ids
      expressions =
        periods.map do |period|
          month = period.to_datetime
          Sequel[:invoices][:created_at] =~ (month..month.end_of_month)
        end

      invoices_dataset.where(expressions.reduce(&:|)).select(:id)
    end

    private def csv_headers
      @csv_headers ||= {
        invoice_id: 'Invoice Number',
        **super
      }
    end
  end
end
