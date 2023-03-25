Sequel.migration do
  change do
    alter_table :travel_rules do
      add_column :allow_unregistered, :boolean, null: false, default: false
    end
  end
end
