Sequel.migration do
  up do
    alter_table :bookings do
      add_column :supplier_service_id, String
      add_index :supplier_service_id, if_not_exists: true
    end

    run('CREATE INDEX IF NOT EXISTS bookings_supplier_service_id_gin_index ON bookings USING gin (supplier_service_id gin_trgm_ops)')
  end

  down do
    alter_table :bookings do
      drop_column :supplier_service_id
    end
  end
end
