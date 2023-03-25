Sequel.migration do
  change do
    alter_table :travel_reasons do
      add_column :active, :boolean, null: false, default: true
    end
  end
end
