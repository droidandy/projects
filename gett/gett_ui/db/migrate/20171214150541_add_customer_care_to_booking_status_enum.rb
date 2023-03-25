Sequel.migration do
  # drop_enum && create_enum with new enum values does not work:
  # Sequel::DatabaseError: PG::FeatureNotSupported: ERROR:  cannot alter type of a column used by a view or rule

  # add_enum_value with transaction does not work:
  # Sequel::DatabaseError: PG::ActiveSqlTransaction: ERROR:  ALTER TYPE ... ADD cannot run inside a transaction block
  # https://groups.google.com/d/msg/sequel-talk/r8Wcmz_h7wY/5cfihL4LDwAJ

  no_transaction

  up do
    add_enum_value :booking_status, 'customer_care', if_not_exists: true
    add_enum_value :alert_type, 'api_failure', if_not_exists: true
    alter_table :bookings do
      add_column :customer_care_at, DateTime
    end
  end

  down do
    alter_table :bookings do
      drop_column :customer_care_at
    end
  end
end
