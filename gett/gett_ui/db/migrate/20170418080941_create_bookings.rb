Sequel.migration do
  change do
    create_table :bookings do
      primary_key :id

      foreign_key :booker_id, :users, null: false
      foreign_key :passenger_id, :users, null: true
      String :passenger_first_name
      String :passenger_last_name
      String :passenger_phone
      String :message
      String :option_id
      json :booking_info

      timestamps
    end

    create_table :booking_addresses do
      primary_key :id

      foreign_key :address_id, :addresses, null: false
      foreign_key :booking_id, :bookings, null: false
      String :address_type, null: false

      index [:address_id, :booking_id], unique: true
    end
  end
end
