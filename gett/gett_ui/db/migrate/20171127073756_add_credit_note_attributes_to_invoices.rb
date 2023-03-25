Sequel.migration do
  change do
    create_enum :invoice_type, %w(invoice credit_note)

    alter_table :invoices do
      add_column :type, :invoice_type, null: false, default: 'invoice'
      add_foreign_key :credited_invoice_id, :invoices
    end

    create_table :credit_note_lines do
      primary_key :id

      foreign_key :credit_note_id, :invoices, null: false
      foreign_key :booking_id, :bookings, null: false

      Integer :amount_cents, null: false
      Boolean :vatable, null: false, default: false

      index [:credit_note_id, :booking_id], unique: true
    end
  end
end
