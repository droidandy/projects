Sequel.migration do
  change do
    alter_table :vehicle_vendors do
      add_column :phone, String
    end
  end
end
