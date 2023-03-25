Sequel.migration do
  up do
    alter_table :payment_cards do
      set_column_allow_null :passenger_id, true
      add_foreign_key :company_id, :companies, null: true
    end
  end

  down do
    from(:payment_cards).where(passenger_id: nil).delete

    alter_table :payment_cards do
      set_column_allow_null :passenger_id, false
      drop_column :company_id
    end
  end
end
