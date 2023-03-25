Sequel.migration do
  no_transaction

  up do
    add_enum_value :invoice_type, 'cc_invoice', if_not_exists: true
  end
end
