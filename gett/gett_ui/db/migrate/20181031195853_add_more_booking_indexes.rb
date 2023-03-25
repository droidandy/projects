using Sequel::CoreRefinements

Sequel.migration do
  up do
    alter_table :booking_indexes do
      add_column :service_id, :text
      add_column :supplier_service_id, :text
      add_column :passenger_id, :integer
      add_column :company_id, :integer

      add_index :service_id
      add_index :company_id
      add_index :passenger_id
    end

    run <<-SQL
      CREATE INDEX IF NOT EXISTS booking_indexes_service_id_index
        ON booking_indexes USING gin (service_id gin_trgm_ops);

      CREATE INDEX IF NOT EXISTS booking_indexes_supplier_service_id_index
        ON booking_indexes USING gin (supplier_service_id gin_trgm_ops);
    SQL

    from(:booking_indexes, :bookings, :vehicles, :company_infos)
      .where(:bookings[:id] => :booking_indexes[:booking_id])
      .where(:vehicles[:id] => :bookings[:vehicle_id])
      .where(:company_infos[:id] => :bookings[:company_info_id])
      .update(
        order_id: :lower.sql_function(:order_id),
        service_id: :bookings[:service_id],
        supplier_service_id: :lower.sql_function(:bookings[:supplier_service_id]),
        passenger_id: :bookings[:passenger_id],
        company_id: :company_infos[:company_id]
      )
  end

  down do
    alter_table :booking_indexes do
      drop_column :service_id
      drop_column :supplier_service_id
      drop_column :passenger_id
      drop_column :company_id
      drop_column :company_name
    end
  end
end
