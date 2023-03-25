Sequel.migration do
  up do
    alter_table :bookings do
      rename_column :ot_fare_quote, :fare_quote
    end
  end

  down do
    alter_table :bookings do
      rename_column :fare_quote, :ot_fare_quote
    end
  end
end
