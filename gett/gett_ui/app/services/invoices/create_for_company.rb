module Invoices
  class CreateForCompany < CreateBase
    attributes :company

    DIRECT_DEBIT_DELAY = 3.days

    def execute!
      return if amount_cents.zero?

      transaction do
        result { create_model(invoice, booking_pks: bookings.map(&:id)) }
        assert { update_model(payment_options, business_credit_expended: true) } if business_credit_applicable?
        assert { update_bookings_billed_state }
      end

      return fail! unless invoice.persisted?

      create_payment_or_notify
    end

    def invoice
      @invoice ||= Invoice.new(
        company:               company,
        invoicing_schedule:    invoicing_schedule,
        payment_terms:         payment_terms,
        billing_period_start:  billing_period.begin,
        billing_period_end:    billing_period.end,
        overdue_at:            overdue_at,
        amount_cents:          charged_amount_cents,
        paid_amount_cents:     0,
        business_credit_cents: business_credit_cents,
        paid_at:               charged_amount_cents.zero? ? Time.current : nil # TODO: ???
      )
    end

    private def bookings
      @bookings ||=
        company.bookings_dataset
          .eager(:charges)
          .where(
            payment_method: invoice_payment_type,
            scheduled_at: billing_period,
            # in prod environment only not billed bookings are allowed to be added to invoice
            billed: [!Rails.env.production?, false]
          )
          .final
          .all
    end

    private def charged_amount_cents
      [amount_cents - available_business_credit_cents.to_i, 0].max
    end

    private def business_credit_cents
      [amount_cents, available_business_credit_cents].min if available_business_credit_cents.present?
    end

    private def business_credit_applicable?
      business_credit.present? && !business_credit_expended?
    end

    private def available_business_credit_cents
      (business_credit * 100).to_i if business_credit_applicable?
    end

    private def create_payment_or_notify
      case invoice_payment_type
      when 'company_payment_card'
        create_payment_service.execute
      when 'account'
        send_email_notification
        schedule_direct_debit if company.direct_debit_set_up?
      end
    end

    private def send_email_notification
      Invoices::NotifyCompany.new(invoice: invoice).execute.result
    end

    private def schedule_direct_debit
      DirectDebitPaymentWorker.perform_in(DIRECT_DEBIT_DELAY, invoice.id)
    end
  end
end
