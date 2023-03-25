Sequel.migration do
  change do
    alter_table :payment_options do
      add_column :payment_terms, 'float'
      add_column :invoicing_schedule, String
      add_column :split_invoice, String
      add_column :additional_billing_recipients, String, text: true
    end
  end
end
