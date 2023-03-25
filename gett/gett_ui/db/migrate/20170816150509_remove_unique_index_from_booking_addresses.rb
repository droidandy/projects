Sequel.migration do
  up do
    alter_table :booking_addresses do
      drop_index [:address_id, :booking_id]
    end
  end

  down do
    alter_table :booking_addresses do
      add_index [:address_id, :booking_id], unique: true
    end
  end
end
