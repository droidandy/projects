Sequel.migration do
  no_transaction

  up do
    # the purpose of this migration is to exclude 'driver_tracking_not_available' enum value from :alert_type enum
    DB[:alerts].where(type: 'driver_tracking_not_available').delete

    alter_table :alerts do
      set_column_type :type, String
    end

    drop_enum :alert_type

    create_enum :alert_type, %w(
      api_failure
      driver_is_late
      order_changed
      has_no_driver
      has_no_supplier
      flight_cancelled
      flight_redirected
      flight_diverted
      flight_delayed
    )

    alter_table :alerts do
      set_column_type :type, :alert_type, using: 'type::alert_type'
    end
  end

  down do
    add_enum_value :alert_type, 'driver_tracking_not_available', if_not_exists: true
  end
end
