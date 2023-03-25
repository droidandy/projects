Sequel.migration do
  change do
    alter_table :booking_drivers do
      add_column :vendor_name, String
    end
  end
end
