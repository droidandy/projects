Sequel.migration do
  change do
    alter_table :passenger_addresses do
      add_column :pickup_message, String
      add_column :destination_message, String
    end
  end
end
