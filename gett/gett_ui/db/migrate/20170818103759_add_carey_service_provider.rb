Sequel.migration do
  # add_enum_value with transaction does not work:
  # Sequel::DatabaseError: PG::ActiveSqlTransaction: ERROR:  ALTER TYPE ... ADD cannot run inside a transaction block
  # https://groups.google.com/d/msg/sequel-talk/r8Wcmz_h7wY/5cfihL4LDwAJ

  no_transaction

  up do
    add_enum_value :service_provider, 'carey', if_not_exists: true

    alter_table :bookings do
      add_column :carey_token, String
    end
  end

  down do
    alter_table :bookings do
      remove_column :carey_token
    end
  end
end
