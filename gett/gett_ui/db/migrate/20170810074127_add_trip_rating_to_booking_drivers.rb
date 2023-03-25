Sequel.migration do
  change do
    alter_table :booking_drivers do
      add_column :trip_rating, Integer
    end
  end
end
