module Invoices
  class Show < Shared::Invoices::Show
    def execute!
      super.merge(
        'billing_period_start' => invoice.billing_period_start,
        'billing_period_end'   => invoice.billing_period_end,
        'status_label'         => status_label,
        'payment_pending'      => invoice.payment_pending?,
        'display_id'           => display_id,
        'description'          => description
      )
    end

    private def status_label
      I18n.t("invoices.status.#{invoice.status}")
    end

    private def display_id
      if invoice.credit_note?
        "CN-#{invoice.id}"
      else
        "INV-#{invoice.id}"
      end
    end

    private def description
      if invoice.credit_note?
        invoice.credit_note_lines.pluck(:booking_id).join(', ')
      else
        [
          invoice.billing_period_start.in_time_zone(Settings.time_zone).strftime('%d/%m/%Y'),
          invoice.billing_period_end.in_time_zone(Settings.time_zone).strftime('%d/%m/%Y')
        ].join(' - ')
      end
    end
  end
end
