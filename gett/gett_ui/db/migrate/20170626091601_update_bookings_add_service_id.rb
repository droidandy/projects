using Sequel::CoreRefinements

Sequel.migration do
  up do
    alter_table :bookings do
      add_column :service_id, String, index: true
    end

    booking_info_json = Sequel.pg_json_op(:booking_info)
    from(:bookings).update(service_id: :coalesce.sql_function(
      booking_info_json.get_text('ride_id'), booking_info_json.get_text('external_reference')
    ))
  end

  down do
    alter_table :bookings do
      drop_column :service_id
    end
  end
end
