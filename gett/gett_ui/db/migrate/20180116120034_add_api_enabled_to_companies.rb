Sequel.migration do
  change do
    alter_table :companies do
      add_column :api_enabled, 'Boolean', default: false, null: false
    end
  end
end
