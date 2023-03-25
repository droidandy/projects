using Sequel::CoreRefinements

module Admin::Invoices
  class ExportCSV < Shared::Invoices::ExportCSV
    def self.policy_class
      Admin::Invoices::Policy
    end

    private def csv_headers
      @csv_headers ||= {
        company_id: 'Company ID',
        **super
      }
    end

    private def invoices_dataset
      DB[:invoices]
    end
  end
end
