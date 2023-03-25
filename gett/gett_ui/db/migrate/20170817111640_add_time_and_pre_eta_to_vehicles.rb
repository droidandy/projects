Sequel.migration do
  up do
    drop_view :vehicle_products, if_exists: true

    alter_table :vehicles do
      add_column :pre_eta, :integer, null: false, default: 0
      add_column :earliest_available_in, :integer, null: false, default: 0
    end

    DB[:vehicles].where(service_type: 'gett').update(earliest_available_in: 30)
    DB[:vehicles].where(service_type: 'ot').update(pre_eta: 30, earliest_available_in: 60)
  end

  down do
    alter_table :vehicles do
      drop_column :pre_eta
      drop_column :earliest_available_in
    end
  end
end
