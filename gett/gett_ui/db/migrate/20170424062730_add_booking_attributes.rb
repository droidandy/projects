Sequel.migration do
  up do
    create_enum :booking_status, %w(pending in_progress cancelled completed)
    create_enum :service_provider, %w(ot gett flightstats)

    create_table :vehicles do
      primary_key :id
      String :name, null: false
      String :value, null: false
      service_provider :service_type, null: false
    end

    alter_table :bookings do
      add_column :cost_cents, Integer, null: false, default: 0
      add_column :status, 'booking_status', null: false, default: 'pending'
      add_foreign_key :vehicle_id, :vehicles
      drop_column :option_id
    end
  end

  down do
    alter_table :bookings do
      drop_column :cost_cents
      drop_column :status
      drop_column :vehicle_id
      add_column :option_id, String
    end

    drop_table :vehicles
    drop_enum :service_provider
  end
end
