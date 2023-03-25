Sequel.migration do
  change do
    alter_table :booking_charges do
      add_column :cancellation_fee, Integer, null: false, default: 0
    end
  end
end
