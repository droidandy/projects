Sequel.migration do
  change do
    create_enum :direct_debit_payment_status, %w(pending successful failed)

    create_table :direct_debit_payments do
      primary_key :id
      foreign_key :invoice_id, :invoices, null: false, index: true
      foreign_key :direct_debit_mandate_id, :direct_debit_mandates, null: false, index: true
      String :go_cardless_payment_id, null: false
      Integer :amount_cents, null: false
      String :currency, null: false, default: 'GBP'
      column :status, :direct_debit_payment_status, null: false

      timestamps
    end
  end
end
