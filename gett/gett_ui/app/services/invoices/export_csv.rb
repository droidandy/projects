using Sequel::CoreRefinements

module Invoices
  class ExportCSV < Shared::Invoices::ExportCSV
    def self.policy_class
      Invoices::Policy
    end

    private def invoices_dataset
      context.company.invoices_dataset
    end
  end
end
