module Invoices
  class Receipt < NotifyCompany
    def execute!
      recipients.each do |recipient|
        InvoicesMailer.receipt(invoice.id, recipient).deliver_later
      end
    end
  end
end
