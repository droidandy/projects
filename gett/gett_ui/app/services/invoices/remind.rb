module Invoices
  class Remind < NotifyCompany
    include ApplicationService::ModelMethods

    attributes :invoice, :office

    def execute!
      if office == :front
        recipients.each{ |recipient| InvoicesMailer.company_reminder(invoice.id, recipient).deliver_later }
      else
        recipient = (company.account_manager || company.salesman)&.as_json(only: :email, include: :full_name)

        InvoicesMailer.user_reminder(invoice.id, recipient).deliver_later if recipient.present?
      end
    end
  end
end
