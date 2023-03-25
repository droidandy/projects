Sequel.migration do
  change do
    alter_table :addresses do
      add_column :postal_code, String
    end
  end
end
