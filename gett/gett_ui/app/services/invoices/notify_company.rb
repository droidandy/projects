module Invoices
  class NotifyCompany < ApplicationService
    attributes :invoice

    delegate :company, to: :invoice

    def execute!
      recipients.each do |recipient|
        InvoicesMailer.public_send(mailer_method, invoice.id, recipient).deliver_later
      end
    end

    private def recipients
      recipients = [company.admin] + company.financiers
      recipients << company.billing_contact if company.billing_contact&.email.present?
      recipients.compact.as_json(only: :email, include: :full_name) + additional_billing_recipients
    end

    private def additional_billing_recipients
      company.payment_options.additional_billing_recipient_emails.map do |email|
        {'email' => email}
      end
    end

    private def mailer_method
      if invoice.credit_note?
        :credit_note_notification
      else
        :company_invoice_notification
      end
    end
  end
end
