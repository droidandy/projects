Sequel.migration do
  change do
    alter_table :bookings do
      add_column :started_locating_at, DateTime
    end
  end
end
