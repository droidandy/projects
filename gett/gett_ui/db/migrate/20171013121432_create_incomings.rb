Sequel.migration do
  change do
    create_table :incomings do
      primary_key :id
      foreign_key :booking_id, :bookings
      service_provider :service_type, null: false

      jsonb :payload
      jsonb :api_errors

      timestamps
    end
  end
end
