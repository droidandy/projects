Sequel.migration do
  change do
    alter_table :predefined_addresses do
      add_column :city, :text
    end
  end
end
