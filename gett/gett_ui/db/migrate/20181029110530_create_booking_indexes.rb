using Sequel::CoreRefinements

Sequel.migration do
  up do
    create_table :booking_indexes do
      foreign_key :booking_id, :bookings

      DateTime :local_scheduled_at, index: true
      String :order_id
      String :passenger_full_name
      String :vendor_name, index: true

      index :booking_id, unique: true
    end

    run <<-SQL
      CREATE INDEX IF NOT EXISTS booking_indexes_order_id_index
        ON booking_indexes USING gin (order_id gin_trgm_ops);

      CREATE INDEX IF NOT EXISTS booking_indexes_passenger_full_name_index
        ON booking_indexes USING gin (passenger_full_name gin_trgm_ops);
    SQL

    from(:booking_indexes)
      .insert(
        [:booking_id, :local_scheduled_at, :order_id, :vendor_name, :passenger_full_name],
        from(:bookings)
          .join(:vehicles, id: :bookings[:vehicle_id])
          .left_join(:booking_drivers, booking_id: :bookings[:id])
          .left_join(:booking_addresses, booking_id: :bookings[:id], address_type: 'pickup')
          .left_join(:addresses, id: :booking_addresses[:address_id])
          .left_join(:users, id: :bookings[:passenger_id])
          .select(
            :bookings[:id],
            :coalesce.sql_function(
              :bookings[:scheduled_at].at_time_zone('UTC').at_time_zone(:addresses[:timezone]),
              :bookings[:scheduled_at]
            ),
            Sequel.case(
              {{:vehicles[:service_type] => 'splyt'} => Sequel.join(['sp', :bookings[:id]])},
              :bookings[:service_id]
            ),
            Sequel.case(
              {
                {:vehicles[:service_type] => 'ot'} => :booking_drivers[:vendor_name],
                {:vehicles[:service_type] => 'get_e'} => 'GetE',
                {:vehicles[:service_type] => 'gett', :addresses[:country_code] => 'RU'} => 'Gett RU',
                {:vehicles[:service_type] => 'gett', :addresses[:country_code] => 'IL'} => 'Gett IL',
                {:vehicles[:service_type] => 'gett'} => 'Gett UK'
              },
              nil
            ),
            :lower.sql_function(
              Sequel.case(
                {~{passenger_id: nil} => :concat_ws.sql_function(' ', :users[:first_name], :users[:last_name])},
                :concat_ws.sql_function(' ', :bookings[:passenger_first_name], :bookings[:passenger_last_name])
              )
            )
          )
      )
  end

  down do
    drop_table :booking_indexes
  end
end
