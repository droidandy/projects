Sequel.migration do
  no_transaction

  up do
    add_enum_value :service_provider, 'nexmo', if_not_exists: true
  end
end
