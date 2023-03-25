Sequel.migration do
  no_transaction

  up do
    add_enum_value :payment_type, 'passenger_payment_card_periodic', if_not_exists: true
  end
end
