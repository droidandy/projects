Sequel.migration do
  change do
    alter_table :bookings do
      add_foreign_key :cancelled_by_id, :users
    end
  end
end
