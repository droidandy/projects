using Sequel::CoreRefinements

Sequel.migration do
  up do
    drop_view :orders, if_exists: true

    alter_table :booking_addresses do
      add_column :passenger_address_type, :address_type
      set_column_type :address_type, :address_type, using: 'address_type::address_type'
    end

    from(:booking_addresses, :bookings, :passenger_addresses)
      .where(
        :booking_addresses[:booking_id] => :bookings[:id],
        :bookings[:passenger_id] => :passenger_addresses[:passenger_id],
        :booking_addresses[:address_id] => :passenger_addresses[:address_id]
      )
      .update(passenger_address_type: :passenger_addresses[:type])
  end

  down do
    drop_view :orders, if_exists: true

    alter_table :booking_addresses do
      drop_column :passenger_address_type
      set_column_type :address_type, :text
    end
  end
end
