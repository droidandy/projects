Sequel.migration do
  up do
    create_enum :invoicing_schedule, %w(weekly monthly)

    alter_table :payment_options do
      set_column_type :payment_terms, Integer
      set_column_type :invoicing_schedule, 'invoicing_schedule', using: 'NULL::invoicing_schedule'
    end
  end

  down do
    alter_table :payment_options do
      set_column_type :payment_terms, Float
      set_column_type :invoicing_schedule, String
    end

    drop_enum :invoicing_schedule
  end
end
