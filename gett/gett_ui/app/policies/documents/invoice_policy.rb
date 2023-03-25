module Documents
  class InvoicePolicy < ServicePolicy
    allow_all!

    scope do |user|
      if user.executive? || user.finance?
        user.company.invoices_dataset
      else
        ::Invoice.dataset.nullify
      end
    end
  end
end
