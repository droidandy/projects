Sequel.migration do
  change do
    alter_table :companies do
      add_column :api_notifications_enabled, :boolean, default: true
    end
  end
end
