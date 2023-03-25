Sequel.migration do
  # drop_enum && create_enum with new enum values does not work:
  # Sequel::DatabaseError: PG::FeatureNotSupported: ERROR:  cannot alter type of a column used by a view or rule

  # add_enum_value with transaction does not work:
  # Sequel::DatabaseError: PG::ActiveSqlTransaction: ERROR:  ALTER TYPE ... ADD cannot run inside a transaction block
  # https://groups.google.com/d/msg/sequel-talk/r8Wcmz_h7wY/5cfihL4LDwAJ

  no_transaction

  up do
    add_enum_value :booking_status, 'processing', if_not_exists: true
  end
end
