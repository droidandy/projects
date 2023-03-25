Sequel.migration do
  change do
    alter_table :bookings do
      add_column :flight, String
    end
  end
end
