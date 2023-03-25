Sequel.migration do
  change do
    alter_table :addresses do
      add_column :region, String
    end

    alter_table :predefined_addresses do
      add_column :region, String
    end
  end
end
