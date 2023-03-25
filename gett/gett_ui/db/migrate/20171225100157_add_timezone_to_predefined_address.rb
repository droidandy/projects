Sequel.migration do
  change do
    alter_table :predefined_addresses do
      add_column :timezone, String
    end
  end
end
