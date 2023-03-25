Sequel.migration do
  up do
    create_table :invoices do
      primary_key :id
      foreign_key :company_id, null: false
      invoicing_schedule :invoicing_schedule, null: false
      Integer :payment_terms, null: false
      DateTime :billing_period_start, null: false
      DateTime :billing_period_end, null: false
      DateTime :overdue_at, null: false
      Integer :amount_cents, null: false
      DateTime :paid_at

      timestamps

      index :company_id
    end

    # start invoice ids from 10000
    run("SELECT setval('invoices_id_seq', 10000)")

    create_table :bookings_invoices do
      foreign_key :invoice_id, null: false
      foreign_key :booking_id, null: false

      index :invoice_id
      index :booking_id
    end

    create_table :invoices_payments do
      foreign_key :invoice_id, null: false
      foreign_key :payment_id, null: false

      index :invoice_id
      index :payment_id
    end

    alter_table :payments do
      set_column_allow_null :booking_id
    end
  end

  down do
    drop_table :bookings_invoices
    drop_table :invoices_payments

    from(:payments).where(booking_id: nil).delete

    alter_table :payments do
      set_column_not_null :booking_id
    end

    drop_table :invoices
  end
end
