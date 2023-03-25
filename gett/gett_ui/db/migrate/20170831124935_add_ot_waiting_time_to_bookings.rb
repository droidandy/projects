Sequel.migration do
  change do
    alter_table :bookings do
      add_column :ot_waiting_time, Integer
    end
  end
end
