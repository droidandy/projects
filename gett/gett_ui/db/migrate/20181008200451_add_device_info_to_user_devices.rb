Sequel.migration do
  change do
    alter_table :user_devices do
      add_column :device_type, String
      add_column :api_version, String, default: 'v1'
      add_column :os_type, String
      add_column :client_os_version, String
      add_column :device_network_provider, String
      add_column :last_logged_in_at, DateTime
    end
  end
end
