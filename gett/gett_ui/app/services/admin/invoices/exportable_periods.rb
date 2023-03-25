module Admin::Invoices
  class ExportablePeriods < ::Shared::ExportablePeriods
    include ApplicationService::Policy
    include ApplicationService::Context

    def self.policy_class
      Admin::Invoices::Policy
    end

    private def objects_dataset
      DB[:invoices]
    end
  end
end
