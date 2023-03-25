Sequel.migration do
  up do
    alter_table :invoices do
      add_column :paid_amount_cents, Integer
    end

    # default value for credit_notes is nil
    # default value for unpaid invoices is 0
    # default value for paid invoices is equal to amount
    from(:invoices)
      .where(type: 'invoice', paid_at: nil)
      .update(paid_amount_cents: 0)

    from(:invoices)
      .where(type: 'invoice')
      .exclude(paid_at: nil)
      .update(paid_amount_cents: :amount_cents)
  end

  down do
    alter_table :invoices do
      drop_column :paid_amount_cents
    end
  end
end
