module Admin::Invoices
  class Show < Shared::Invoices::Show
    def execute!
      super.merge(
        'company_id'             => invoice.company_id,
        'status_label'           => status_label,
        'company_name'           => invoice.company_name,
        'overdue_at'             => overdue_at,
        'overdue_by'             => overdue_by,
        'transaction_id'         => transaction_id,
        'company_payment_method' => company_payment_method,
        'company_payment_types'  => invoice.company_payment_types,
        'paid_amount_cents'      => invoice.paid_amount_cents,
        'payment_details'        => payment_details,
        'is_reviewable'          => invoice.reviewable?,
        'paid_at'                => invoice.paid_at
      ).tap do |hash|
        if invoice.credit_note?
          hash['created_by_name'] = invoice.created_by&.first_name
          hash['created_by_id'] = invoice.created_by&.id
        end
      end
    end

    private def status_label
      if invoice.paid? && invoice.paid_by.present?
        I18n.t("invoices.status.paid_by", name: invoice.paid_by.full_name)
      elsif invoice.partially_paid? && invoice.paid_by.present?
        I18n.t("invoices.status.partially_paid_by", name: invoice.paid_by.full_name)
      elsif invoice.paid? && invoice.paid_by_business_credit?
        I18n.t("invoices.status.paid_by_business_credit")
      else
        I18n.t("invoices.status.#{invoice.status}")
      end
    end

    private def overdue_by
      return unless invoice.overdue?

      days = (Time.current - invoice.overdue_at).to_i / 1.day + 1
      "#{days} days"
    end

    private def overdue_at
      return if invoice.credit_note?

      invoice.overdue_at
    end

    private def transaction_id
      last_payment = invoice.last_payment
      last_payment.try(:payments_os_id) || last_payment.try(:go_cardless_payment_id)
    end

    private def company_payment_method
      return :direct_debit if invoice.company.direct_debit_set_up?
      return :payment_card if invoice.company.payment_cards.any?
    end

    private def payment_details
      payment = invoice.last_payment
      fields =
        case payment
        when Payment
          %i(payments_os_id zooz_request_id error_description)
        when DirectDebitPayment
          %i(go_cardless_payment_id)
        end
      payment.as_json(only: fields)
    end
  end
end
