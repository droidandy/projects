Sequel.migration do
  up do
    # some (actually all) mentioned indexes have already been added to production
    # env. thus, such uncommon usage with overridden DB.add_index method
    add_index :members, :id, if_not_exists: true

    add_index :bookings, :service_id, if_not_exists: true
    add_index :bookings, :status, if_not_exists: true

    add_index :booking_addresses, :address_type, if_not_exists: true

    add_index :audit_logs, [:model_type, :model_pk], if_not_exists: true
    add_index :audit_logs, :event, if_not_exists: true
    add_index :audit_logs, :user_id, if_not_exists: true
  end

  down do
    alter_table :members do
      drop_index :id
    end

    alter_table :bookings do
      drop_index :service_id
      drop_index :status
    end

    alter_table :booking_addresses do
      drop_index :address_type
    end

    alter_table :audit_logs do
      drop_index [:model_type, :model_pk]
      drop_index :event
      drop_index :user_id
    end
  end
end
