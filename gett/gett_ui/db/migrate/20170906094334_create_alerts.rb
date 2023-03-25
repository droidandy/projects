Sequel.migration do
  change do
    create_enum :alert_type, %w(
      driver_tracking_not_available
      driver_is_late
      order_changed
      has_no_driver
      has_no_supplier
      flight_cancelled
      flight_redirected
      flight_diverted
      flight_delayed
    )

    create_enum :alert_level, %w(critical medium normal)

    create_table :alerts do
      primary_key :id
      foreign_key :booking_id, :bookings, null: false
      alert_type  :type, null: false
      alert_level :level, null: false
      String :message

      timestamps
    end
  end
end
