Sequel.migration do
  change do
    alter_table :booking_drivers do
      add_column :pickup_distance, Float
    end

    alter_table :bookings do
      add_column :travel_distance, Float
    end
  end
end
