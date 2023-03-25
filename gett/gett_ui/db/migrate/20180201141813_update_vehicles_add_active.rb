Sequel.migration do
  up do
    alter_table :vehicles do
      add_column :active, :bool, null: false, default: true
    end

    from(:vehicles).where(name: 'Courier').update(active: false)
  end

  down do
    alter_table :vehicles do
      drop_column :active, cascade: true
    end
  end
end
