Sequel.migration do
  feet_in_mile = 5280

  up do
    from(:booking_drivers).update(distance: Sequel[:distance] * feet_in_mile)

    alter_table :booking_drivers do
      set_column_type :distance, Integer, using: 'ROUND(distance)'
    end
  end

  down do
    alter_table :booking_drivers do
      set_column_type :distance, Float
    end

    from(:booking_drivers).update(distance: Sequel[:distance] / feet_in_mile)
  end
end
