module Shared::Invoices
  class Show < ApplicationService
    attributes :invoice

    delegate :url_helpers, to: 'Rails.application.routes'

    def execute!
      invoice.as_json(
        only: %i[id type created_at overdue_at amount_cents paid_amount_cents under_review],
        include: %i[status]
      ).merge(
        'is_credit_note'    => invoice.credit_note?,
        'pdf_document_path' => pdf_document_path,
        'payment_type'      => payment_type,
        'user_name'         => invoice.member_full_name
      )
    end

    def pdf_document_path
      if invoice.credit_note?
        url_helpers.credit_note_document_path(credit_note_id: invoice.id, format: :pdf)
      else
        url_helpers.invoice_document_path(invoice_id: invoice.id, format: :pdf)
      end
    end

    private def payment_type
      case invoice.last_payment
      when Payment then :payment_card
      when DirectDebitPayment then :direct_debit
      end
    end
  end
end
