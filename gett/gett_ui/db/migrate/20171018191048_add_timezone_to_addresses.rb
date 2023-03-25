Sequel.migration do
  change do
    alter_table :addresses do
      add_column :timezone, String
    end
  end
end
