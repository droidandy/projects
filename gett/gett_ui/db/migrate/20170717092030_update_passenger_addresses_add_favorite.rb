Sequel.migration do
  up do
    create_enum :address_type, %w(home work favorite legal pickup destination stop)

    alter_table :passenger_addresses do
      add_column :name, String
      add_column :type, :address_type
      add_column :created_at, DateTime
      add_column :updated_at, DateTime
    end

    from(:passenger_addresses).where(work: false).update(type: 'home')
    from(:passenger_addresses).where(work: true).update(type: 'work')
    from(:passenger_addresses).update(created_at: Time.current, updated_at: Time.current)

    alter_table :passenger_addresses do
      set_column_not_null :type
      set_column_not_null :created_at
      set_column_not_null :updated_at
      drop_column :work
    end
  end

  down do
    alter_table :passenger_addresses do
      add_column :work, :Boolean, default: false
    end

    from(:passenger_addresses).where(type: 'work').update(work: true)
    from(:passenger_addresses).exclude(type: 'work').update(work: false)

    alter_table :passenger_addresses do
      set_column_not_null :work
      drop_column :name
      drop_column :type
      drop_column :created_at
      drop_column :updated_at
    end

    drop_enum :address_type
  end
end
