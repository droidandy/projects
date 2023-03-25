Sequel.migration do
  change do
    alter_table :bookings do
      add_column :allocated_at, DateTime
    end
  end
end
