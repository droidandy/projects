Sequel.migration do
  change do
    create_enum :currency, %w(EUR USD GBP)
    create_enum :payments_status, %w(initialized pending authorized captured refunded voided failed credited)

    create_table :payments do
      primary_key :id
      foreign_key :booking_id, :bookings, null: false, unique: true
      payments_status :status, null: false, default: 'initialized'
      Integer :amount_cents, null: false
      currency :currency, null: false, default: 'GBP'
      String :description
      String :payments_os_id
      String :error_description

      timestamps
    end
  end
end
