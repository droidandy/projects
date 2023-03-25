Sequel.migration do
  change do
    alter_table :booking_drivers do
      add_column :bearing, Integer, default: nil
    end
  end
end
