Sequel.migration do
  change do
    alter_table :booking_drivers do
      add_column :phv_license, String
    end
  end
end
