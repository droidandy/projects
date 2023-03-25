module Invoices
  class CreateForPassenger < CreateBase
    attributes :passenger

    delegate :company, to: :passenger

    def execute!
      return if amount_cents.zero?

      transaction do
        result { create_model(invoice, booking_pks: bookings.map(&:id)) }
        assert { update_bookings_billed_state }
      end

      return fail! unless invoice.persisted?

      send_invoice_created_notification

      if create_payment_service.execute.success?
        send_passenger_notification
      else
        send_manager_notification
      end
    end

    def invoice
      @invoice ||= Invoice.new(
        type:                  Invoice::Type::CC_INVOICE,
        company:               company,
        member:                passenger,
        invoicing_schedule:    payment_options.invoicing_schedule,
        payment_terms:         payment_terms,
        billing_period_start:  billing_period.begin,
        billing_period_end:    billing_period.end,
        overdue_at:            overdue_at,
        amount_cents:          amount_cents,
        paid_amount_cents:     0,
        business_credit_cents: 0,
        paid_at:               nil
      )
    end

    private def bookings
      @bookings ||=
        company.bookings_dataset
          .eager(:charges)
          .where(
            scheduled_at: billing_period,
            passenger_id: passenger.id,
            # in prod environment only not billed bookings are allowed to be added to invoice
            billed: [!Rails.env.production?, false]
          )
          .final
          .all
    end

    private def send_passenger_notification
      recipient = invoice.member.as_json(only: :email, include: :full_name)

      InvoicesMailer.passenger_invoice_notification(invoice.id, recipient).deliver_later
    end

    private def send_manager_notification
      InvoicesMailer.account_manager_outstanding_notification(invoice.id).deliver_later
    end

    private def send_invoice_created_notification
      recipient = invoice.member.as_json(only: :email, include: :full_name)

      InvoicesMailer.passenger_invoice_created_notification(invoice.id, recipient).deliver_later
    end

    private def create_payment_service
      @create_payment_service ||= InvoicePayments::CreateAutomaticForPassenger.new(passenger: passenger)
    end
  end
end
