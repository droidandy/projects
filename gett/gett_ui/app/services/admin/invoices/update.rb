module Admin::Invoices
  class Update < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :invoice, :params
    delegate :errors, to: :invoice

    def self.policy_class
      Admin::Invoices::ManagePolicy
    end

    def execute!
      update_model(invoice, params)
    end

    def show_result
      Admin::Invoices::Show.new(invoice: invoice).execute.result
    end
  end
end
