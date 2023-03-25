Sequel.migration do
  up do
    from(:payment_options).where(payment_terms: nil).update(payment_terms: 30)
    from(:payment_options).where(invoicing_schedule: nil).update(invoicing_schedule: 'monthly')

    alter_table :payment_options do
      set_column_not_null :payment_terms
      set_column_not_null :invoicing_schedule
    end
  end

  def down
    alter_table :payment_options do
      set_column_allow_null :payment_terms
      set_column_allow_null :invoicing_schedule
    end
  end
end
