Sequel.migration do
  change do
    alter_table :bookings do
      add_column :booked_at, DateTime
    end
  end
end
