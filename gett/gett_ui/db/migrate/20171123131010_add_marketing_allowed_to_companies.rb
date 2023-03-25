Sequel.migration do
  change do
    alter_table :companies do
      add_column :marketing_allowed, :boolean, null: false, default: false
    end
  end
end
