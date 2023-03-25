Sequel.migration do
  up do
    alter_table :passenger_addresses do
      drop_index [:passenger_id, :address_id], if_exists: true

      add_index [:passenger_id, :address_id, :type],
        unique: true,
        where:  { type: 'favorite' }

      add_index [:passenger_id, :address_id],
        unique: true,
        where:  { type: %w(home work) }

      add_index [:passenger_id, :type],
        unique: true,
        where:  { type: %w(home work) }
    end
  end

  down do
    alter_table :passenger_addresses do
      drop_index [:passenger_id, :address_id], if_exists: true
      drop_index [:passenger_id, :address_id, :type], if_exists: true
      drop_index [:passenger_id, :type], if_exists: true

      add_index [:passenger_id, :address_id], unique: true
    end
  end
end
