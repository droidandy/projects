module Admin::Invoices
  class IssueCreditNote < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :invoice, :credit_note_lines

    delegate :admin, to: :context

    def self.policy_class
      Admin::Invoices::Policy
    end

    def execute!
      transaction do
        result do
          create_model(credit_note,
            amount_cents: amount_cents,
            created_by: admin
          )
        end
        credit_note_line_records.each do |line|
          assert { create_model(line, credit_note_id: credit_note.id) }
        end
      end

      send_email_notification
    end

    private def credit_note
      @credit_note ||= Invoice.new(copied_attributes.merge(type: Invoice::Type::CREDIT_NOTE))
    end

    private def credit_note_line_records
      @credit_note_line_records ||=
        credit_note_lines.map do |line|
          amount_cents = (line.fetch(:amount) * 100).round
          vatable = line.fetch(:vatable, false)
          vat = vatable ? (amount_cents * Settings.vat_rate).round : 0

          CreditNoteLine.new(
            booking_id: line[:booking_id],
            amount_cents: amount_cents,
            vat: vat
          )
        end
    end

    private def copied_attributes
      invoice.values.slice(
        :company_id,
        :invoicing_schedule,
        :payment_terms,
        :billing_period_start,
        :billing_period_end,
        :overdue_at
      )
    end

    private def amount_cents
      credit_note_line_records.sum(&:total_amount_cents)
    end

    private def send_email_notification
      ::Invoices::NotifyCompany.new(invoice: credit_note).execute.result
    end
  end
end
