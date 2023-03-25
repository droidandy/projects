Sequel.migration do
  change do
    alter_table :vehicle_vendors do
      add_column :postcode_prefixes, 'text[]', null: false, default: []
    end
  end
end
