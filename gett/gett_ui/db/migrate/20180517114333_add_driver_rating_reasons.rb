Sequel.migration do
  up do
    drop_column :bookings, :booking_cancellation_reason_id
    drop_table :booking_cancellation_reasons

    add_column :bookings, :cancellation_reason, String
    add_column :booking_drivers, :rating_reasons, 'text[]', null: false, default: []
  end

  down do
    drop_column :bookings, :cancellation_reason
    drop_column :booking_drivers, :rating_reasons

    create_table :booking_cancellation_reasons do
      primary_key :id
      String :text, null: false, unique: true

      timestamps
    end

    alter_table :bookings do
      add_foreign_key :booking_cancellation_reason_id, :booking_cancellation_reasons
    end
  end
end
