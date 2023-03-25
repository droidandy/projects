Sequel.migration do
  change do
    alter_table :drivers_channels do
      add_column :country_code, String
    end
  end
end
