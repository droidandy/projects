Sequel.migration do
  change do
    add_column :invoices, :business_credit_cents, :integer
    add_column :payment_options, :business_credit_expended, :boolean, default: false, allow_nil: false
  end
end
