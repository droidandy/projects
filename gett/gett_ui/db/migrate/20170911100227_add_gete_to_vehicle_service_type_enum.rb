Sequel.migration do
  no_transaction

  up do
    add_enum_value :service_provider, 'get_e', if_not_exists: true
  end
end
