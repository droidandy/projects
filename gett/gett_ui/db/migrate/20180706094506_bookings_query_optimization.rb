Sequel.migration do
  up do
    run('CREATE EXTENSION IF NOT EXISTS pg_trgm')

    create_function('concat_space', <<-SQL, args: ['s1 text', 's2 text'], returns: :text, behavior: :immutable, if_not_exists: true)
      SELECT
        CASE
        WHEN s1 IS NULL THEN s2
        WHEN s2 IS NULL THEN s1
        ELSE s1 || ' ' || s2
        END
    SQL

    alter_table :company_infos do
      add_index :account_manager_id, if_not_exists: true
      add_index :address_id, if_not_exists: true
      add_index :company_id, if_not_exists: true
      add_index :contact_id, if_not_exists: true
      add_index :legal_address_id, if_not_exists: true
      add_index :salesman_id, if_not_exists: true
    end

    alter_table :bookings do
      add_index :company_info_id, if_not_exists: true
      add_index :vehicle_id, if_not_exists: true
      add_index :booker_id, if_not_exists: true
      add_index :passenger_id, if_not_exists: true
      add_index :scheduled_at, if_not_exists: true
    end

    alter_table :bookers_passengers do
      add_index :booker_id, if_not_exists: true
      add_index :passenger_id, if_not_exists: true
    end

    run('CREATE INDEX IF NOT EXISTS users_full_name_index ON users USING gin (concat_space(first_name, last_name) gin_trgm_ops)')
    run('CREATE INDEX IF NOT EXISTS bookings_service_id_gin_index ON bookings USING gin (service_id gin_trgm_ops)')
    run('CREATE INDEX IF NOT EXISTS bookings_passenger_full_name_index ON bookings USING gin (concat_space(passenger_first_name, passenger_last_name) gin_trgm_ops)')
    run('CREATE INDEX IF NOT EXISTS company_infos_name_index ON company_infos USING gin (name gin_trgm_ops)')
  end

  down do
    drop_index :company_infos, :name
    drop_index :users, :full_name

    alter_table :bookers_passengers do
      drop_index :passenger_id
      drop_index :booker_id
    end

    alter_table :bookings do
      drop_index :service_id_gin
      drop_index :passenger_full_name
      drop_index :company_info_id
      drop_index :vehicle_id
      drop_index :scheduled_at
    end

    alter_table :company_infos do
      drop_index :account_manager_id
      drop_index :address_id
      drop_index :company_id
      drop_index :contact_id
      drop_index :legal_address_id
      drop_index :salesman_id
    end

    drop_function :concat_space, args: ['s1 text', 's2 text']
  end
end
