Sequel.migration do
  change do
    alter_table :messages do
      add_column :title, String
    end
  end
end
