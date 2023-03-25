Sequel.migration do
  change do
    alter_table :addresses do
      add_column :city, String
    end
  end
end
