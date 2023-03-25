Sequel.migration do
  no_transaction

  up do
    add_enum_value :payment_type, 'company_payment_card', if_not_exists: true
  end
end
