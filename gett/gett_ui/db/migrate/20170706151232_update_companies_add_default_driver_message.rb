Sequel.migration do
  change do
    alter_table :companies do
      add_column :default_driver_message, String
    end
  end
end
