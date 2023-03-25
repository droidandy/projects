Sequel.migration do
  no_transaction

  up do
    add_enum_value :booking_status, 'customer_care', if_not_exists: true
    add_column :bookings, :customer_care_message, String, text: true
  end

  down do
    drop_column :bookings, :customer_care_message
  end
end
