using Sequel::CoreRefinements

module Invoices
  class Export < Shared::Invoices::Export
    attributes :invoice

    private def invoice_ids
      [invoice.id]
    end
  end
end
