using Sequel::CoreRefinements

module Invoices
  class ExportablePeriods < ::Shared::ExportablePeriods
    def self.policy_class
      Invoices::Policy
    end

    private def objects_dataset
      context.company.invoices_dataset
    end
  end
end
