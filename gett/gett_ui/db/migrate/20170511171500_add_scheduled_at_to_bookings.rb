Sequel.migration do
  change do
    alter_table :bookings do
      add_column :scheduled_at, DateTime
    end
  end
end
