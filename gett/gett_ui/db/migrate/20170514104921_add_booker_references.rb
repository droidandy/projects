Sequel.migration do
  change do
    create_table :booker_references do
      primary_key :id
      foreign_key :booking_id, :bookings, null: false
      foreign_key :booking_reference_id, :booking_references, null: false
      String :value, null: false

      timestamps
    end
  end
end
