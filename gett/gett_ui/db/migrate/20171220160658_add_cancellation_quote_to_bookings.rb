Sequel.migration do
  change do
    alter_table :bookings do
      add_column :cancellation_quote, Integer, default: 0
    end
  end
end
