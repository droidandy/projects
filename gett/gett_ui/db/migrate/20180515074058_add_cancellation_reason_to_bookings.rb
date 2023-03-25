Sequel.migration do
  change do
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
