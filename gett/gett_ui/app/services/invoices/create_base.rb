module Invoices
  class CreateBase < ApplicationService
    include ApplicationService::ModelMethods

    attributes :billing_period

    delegate :payment_options, to: :company
    delegate :invoicing_schedule, :invoice_payment_type, :business_credit,
      :business_credit_expended?, :payment_terms,
      to: :payment_options

    # relies on `#bookings` method that should be implemented by ancestors
    private def update_bookings_billed_state
      DB[:bookings].where(id: bookings.map(&:id)).update(billed: true) > 0
    end

    private def overdue_at
      Time.current.beginning_of_day + payment_terms.days
    end

    private def amount_cents
      bookings.map{ |b| b.charges&.total_cost }.compact.sum
    end

    private def create_payment_service
       @create_payment_service ||= InvoicePayments::CreateAutomatic.new(company: company)
    end

    private def bookings
      fail "#{self.class.name} does not implement #{__method__}"
    end
  end
end
