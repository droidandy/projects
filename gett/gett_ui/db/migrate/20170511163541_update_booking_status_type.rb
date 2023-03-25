using Sequel::CoreRefinements

Sequel.migration do
  up do
    alter_table :bookings do
      set_column_type :status, String
      set_column_allow_null :status
      set_column_default :status, nil
    end

    drop_enum :booking_status
    # old enum values: %w(pending in_progress cancelled completed)
    create_enum :booking_status, %w(order_received locating on_the_way arrived in_progress completed cancelled rejected)

    from(:bookings).update(status: {'pending' => 'order_received'}.case(:status, :status))

    alter_table :bookings do
      set_column_type :status, 'booking_status USING status::booking_status'
      set_column_default :status, 'order_received'
      set_column_not_null :status
    end
  end

  down do
    alter_table :bookings do
      set_column_type :status, String
      set_column_allow_null :status
      set_column_default :status, nil
    end

    drop_enum :booking_status
    create_enum :booking_status, %w(pending in_progress cancelled completed)

    from(:bookings).update(status: {
      'order_received' => 'pending',
      'locating'       => 'in_progress',
      'on_the_way'     => 'in_progress',
      'arrived'        => 'in_progress',
      'rejected'       => 'cancelled'
    }.case(:status, :status))

    alter_table :bookings do
      set_column_type :status, 'booking_status USING status::booking_status'
      set_column_default :status, 'pending'
      set_column_not_null :status
    end
  end
end
