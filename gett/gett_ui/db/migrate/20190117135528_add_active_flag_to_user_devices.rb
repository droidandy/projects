Sequel.migration do
  change do
    add_column :user_devices, :active, :boolean, default: true, null: false
  end
end
