module Admin::Invoices
  class Destroy < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :invoice

    def self.policy_class
      Admin::Invoices::Policy
    end

    def execute!
      transaction do
        invoice.lock!
        return unless invoice.status == Invoice::Status::ISSUED

        result { destroy_model(invoice) }
      end
    end
  end
end
