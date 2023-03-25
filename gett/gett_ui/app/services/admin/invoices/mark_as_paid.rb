module Admin::Invoices
  class MarkAsPaid < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :invoice, :partial_pay_amount

    delegate :admin, to: :context

    def self.policy_class
      Admin::Invoices::ManagePolicy
    end

    def execute!
      return if invoice.credit_note?
      return if invoice.paid?

      paid_amount = invoice.paid_amount_cents + partial_pay_amount

      transaction do
        result { invoice.mark_as_paid!(paid_amount, admin) }
        assert { update_model(invoice, under_review: false) }
      end
    end
  end
end
